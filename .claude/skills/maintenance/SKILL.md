---
name: maintenance
description: Dependency maintenance for this repo. Moves the supported Node floor and CI to maintained LTS lines, bumps every npm runtime and dev dependency to its latest version the CommonJS build can load, reviews breaking changes before each major bump, then builds, tests, lints and smoke-tests the CLI against the live Cloudflare API with a read-only token, fixes what broke, and opens a PR with version tables. Use when the user asks to "update dependencies", "run maintenance", "upgrade packages", "bump node", or types /maintenance.
user-invocable: true
---

# Maintenance: update everything, then prove the CLI still runs

Three update tracks, one verify-and-fix loop, then a pull request. Work through them in order. Each track ends in its own commit so a bad bump can be reverted alone.

Shell state doesn't persist between Bash calls. Write this to `<scratchpad>/env.sh` once and start every call with `source <scratchpad>/env.sh`:

```bash
source ~/.nvm/nvm.sh >/dev/null
cd "$(git rev-parse --show-toplevel)"   # run from inside the repo
S=<scratchpad>
ON() { local v=$1; shift; nvm exec --silent "$v" "$@"; }   # ON 22 npm test
CF() { op run --env-file="$S/cf.env" -- env PATH="$PWD/bin:$PATH" NODE_OPTIONS="--require $S/cf-token.cjs" cf "$@" --disableSpinner; }
```

Use functions, not variables holding commands: zsh doesn't word-split `$VAR`. `nvm` is a shell function, so it has to be sourced in every call. Installs and test runs can take minutes; send their output to a log in the scratchpad and read the tail.

## Why this repo is touchy

- **Babel compiles `src/` to CommonJS.** Every `import` becomes `require()`. A dependency that went ESM-only in a major (chalk, ora, inquirer, node-fetch, chai and mocha already have; yargs 18 is held back, and anything else whose `package.json` has `"type": "module"` with no `require` export) can only load through `require(esm)` (Node 22.12+). Babel 8 needs 22.18, which sets the current floor. Check each new major with `npm view <pkg>@<ver> type exports engines` before taking it.
- **Tests import from `lib/`**, so `npm test` builds first. A stale `lib/` hides nothing, but a failed build fails every test.
- **Name-to-ID lookups shell out to `cf` on PATH** (`src/classes/cloudflare.js`). Smoke tests must put `$PWD/bin` first in PATH, or they test whatever `cf` is installed globally. The `CF` function does this.
- **`Config` and `Cloudflare` read `yargs.argv` directly.** A yargs major that changes the singleton or `commandDir` breaks token selection and the whole command tree.

## 0. Preflight

1. `git status` must be clean. If it isn't, stop and ask.
2. Look for work already in flight: `gh pr list --state open` (Dependabot PRs this run will supersede) and `git branch -r` for stale upgrade branches. Read their diffs. Reuse what still applies and mention them in the PR, but don't merge or delete them.
3. Branch off `main`: `git switch -c chore-deps-YYYY-MM-DD`. No `/` in branch names.
4. Pick Node versions from https://raw.githubusercontent.com/nodejs/Release/main/schedule.json: **floor** is the oldest line still inside its `end` date, **latest** is the newest line past its `lts` date. The floor is an exact version, not a major: `nvm install 22` gives the newest 22.x, which hides packages that need a later minor. Use the version in `engines.node` (e.g. `nvm install 22.18.0`) for every "floor" run below.
5. Record a baseline **before touching anything**, so pre-existing failures don't get blamed on an update. On both floor and latest:
   ```bash
   ON <v> npm ci            # if ERESOLVE, retry with --legacy-peer-deps and note it
   ON <v> npm test
   ON <v> npm run lint
   ```
   Also note the result of `npm audit --omit=dev`. Save pass/fail per Node version to the scratchpad. A gate that already fails on `main` is reported, not fixed, unless the user says otherwise.
6. Snapshot versions for the final report: `npm ls --depth=0`, `npm outdated`, and the `node-version` lines in `.github/workflows/*.yml`.
7. Set up the read-only API token for smoke tests. It lives in 1Password as `Cloudflare Read Only` in the `Agents` vault. Write only the reference to disk, never the value:
   ```bash
   ID=$(op item list --vault Agents --format json | jq -r '.[] | select(.title=="Cloudflare Read Only") | .id')
   printf 'CF_API_TOKEN=op://Agents/%s/credential\n' "$ID" > "$S/cf.env"
   cat > "$S/cf-token.cjs" <<EOF
   const m = require('$PWD/lib/classes/config');
   const Config = m.default || m;
   if (typeof Config.getAuthToken !== 'function') throw new Error('cf-token preload: Config shape changed');
   Config.getAuthToken = async () => process.env.CF_API_TOKEN;
   EOF
   ```
   The guard matters after a Babel major: if the interop changes and the patch misses, the CLI says "Please run cf config setup", which looks like a token problem. The preload swaps in the token without touching `~/.cloudflare-config`. `NODE_OPTIONS` carries it into the child `cf` processes the name lookups spawn. If the item is missing or `op` says the token expired, skip the live smoke tests and say so in the PR.

## 1. Node floor and CI

1. Update `node-version` in `.github/workflows/build-and-test.yml` to a matrix of the exact floor version (e.g. `22.18.0`) and latest major, and in `npm-publish.yml` to latest. Bump `actions/checkout` and `actions/setup-node` to their current majors (`gh api repos/actions/checkout/releases/latest --jq .tag_name`).
2. Set `engines.node` in `package.json` to `>=<floor>` and update the Requirements line in `README.md` to match.
3. Raising the floor drops support for users on older Node. Add a line under `## [next]` → `### Changed` in `CHANGELOG.md` naming the new minimum.

The floor decides what tracks 2 and 3 can take, dev dependencies included: `npm test` and `npm run lint` must run on the floor too. A new major whose `engines` excludes the floor is held back, or the floor moves up and that is said in the PR. After each track, check the whole lockfile:

```bash
node -e '
const semver = require("./node_modules/semver"), v = process.argv[1];
for (const [k, p] of Object.entries(require("./package-lock.json").packages))
  if (k && p.engines?.node && !semver.satisfies(v, p.engines.node)) console.log(k, p.engines.node);
' <floor>
```

No output means every installed package accepts the floor.

Commit: `chore(ci): move node floor to <floor>, test on <floor> and <latest>`.

## 2. Runtime dependencies

These ship to users: `chalk`, `cli-table3`, `csv-writer`, `form-data`, `fs-extra`, `inquirer`, `lodash`, `node-fetch`, `ora`, `yargs`, `@babel/runtime`.

1. `npm outdated` and pick out the `dependencies`.
2. For each major bump, before changing anything:
   - Read the changelog or GitHub releases for every major in between.
   - Check `npm view <pkg>@<ver> type exports engines`. For an ESM-only release, the floor must support `require(esm)` and the CLI must actually run on the floor in step 4. If either fails, hold it at the last CommonJS major (chalk 4, ora 5, inquirer 8, node-fetch 2) and say so. Don't convert the build to ESM as part of maintenance.
   - `rg` our code for every API the changelog says was removed or renamed.
3. Known pressure points:
   - **yargs**: `commandDir` (every command file), the `yargs.argv` singleton in `config.js` and `cloudflare.js`, `.terminalWidth()` and `.wrap()` in `cli.js`. yargs 18 removed the singleton, so it stays on 17 until those reads take args explicitly.
   - **node-fetch + form-data**: `dns import` posts a `FormData` stream through node-fetch. Replacing node-fetch with native `fetch` changes how multipart bodies work, so treat it as a separate change and don't do it here.
   - **inquirer**: only `config setup` and `config add` prompt. They can't run unattended, so read `src/commands/config_cmd/*.js` against the changelog by hand.
   - **fs-extra**: `Config.read` calls `fs.exists`. Check it still returns a promise.
4. `npm install <pkg>@^<major>` per package, then `npm update` for everything inside its range. If npm reports ERESOLVE while moving a set of packages across a major together (Babel did this), set the ranges with `npm pkg set`, delete `node_modules` and `package-lock.json`, and reinstall.

Commit: `chore(deps): update runtime dependencies`, with required code fixes folded in.

## 3. Dev tooling

1. **Babel**: `@babel/cli`, `@babel/core`, `@babel/preset-env`, `@babel/plugin-transform-runtime`, `@babel/register` and `@babel/runtime` move together on one major. For a Babel major, read the migration guide and check that the options in `.babelrc` still exist. Keep `modules: "commonjs"` (Babel 8 no longer defaults to it) and move the top-level `targets.node` with the floor.
2. **Test stack**: `mocha`, `chai`, `sinon`, `temp`. Tests are compiled by `@babel/register` into `require()`, so the same ESM-only check from track 2 applies to chai. Check `npm view mocha@<ver> engines` against the floor.
3. **ESLint**: `eslint`, `@eslint/js`, `globals`, `eslint-plugin-jsdoc`, `eslint-plugin-prettier`, `eslint-config-prettier`, `prettier`. The flat config in `eslint.config.js` pins the Prettier options inline; keep them unless the user asks. A change of shared config or rule set is a migration, not a bump. Do it in its own commit. If the new config reports style changes across many files, **stop and ask** before reformatting the codebase in a deps PR. Never run `eslint --fix` or `prettier --write` over the repo without the user's go-ahead.
4. **Everything else**: `rimraf`, `cross-env`. `istanbul` is unmaintained and the `cover` script requires `babel-core/register`, which isn't installed. Report it; replacing coverage tooling is out of scope.

Commit: `chore(deps): update dev tooling`, with the lint config migration as a separate commit if there is one.

## 4. Build and verify everything

Run all of it on **both** floor and latest Node, even if an earlier step looked fine.

1. **Gates**:
   ```bash
   ON <v> npm ci            # must pass without --legacy-peer-deps now
   ON <v> npm test          # builds lib/, then mocha
   ON <v> npm run lint
   ON <v> npm audit --omit=dev
   ```
2. **Package contents**: `npm pack --dry-run`. `lib/` must be there; `src/`, `test/`, `.claude/` and `CLAUDE.md` must not.
3. **Every command module loads.** `commandDir` only requires a folder when its parent command builds, so walk the tree:
   ```bash
   for c in accounts config dns filters firewall ips rules user zones "zones settings"; do
     ON <v> node bin/cf ${=c} --help >/dev/null 2>&1 || echo "FAIL: $c"   # ${=c}: zsh word split
   done
   ```
   A `require` error from an ESM-only package shows up here.
4. **Config without secrets**, against the fake token in the test fixture:
   ```bash
   ( T=$(mktemp -d); cp test/fixtures/config/config.json "$T/.cloudflare-config"; HOME=$T ON <v> node bin/cf config list )
   ```
5. **Live read-only smoke tests** with `CF`. `bin/cf` takes `node` from PATH, so run `nvm use --silent <v>` in the same call first. Pick the zone from the account, never hardcode one:
   ```bash
   Z=$(CF zones list --fields=name --format=string | awk '{print $1}')
   CF accounts list
   CF zones list --fields=id,name,status
   CF zones get "$Z" --fields=name_servers
   CF dns list "$Z"                          # zone name -> id via child cf
   CF dns list "$Z" --type=A --format=json
   CF firewall list "$Z"
   CF filters list "$Z"
   CF rules list "$Z"
   CF ips
   CF zones settings devmode "$Z"            # get only, no --value
   CF zones settings ssl "$Z"
   ```
   Run one of them without `--disableSpinner` (call `op run` directly) so `ora` gets exercised too. Expected failures that are not regressions: `cf user get` returns "Unauthorized" with this token, and `firewall list` and `filters list` return `*.api.deprecated` because Cloudflare retired those APIs in favour of Rulesets (true as of 2026-11; if they start passing, someone ported them). List them under pre-existing failures.

   **Never** run `create`, `update`, `delete`, `import`, `purge`, or any `settings` subcommand with `--value`. The token is read-only, but don't rely on that.

   Compare output shape with the baseline: same columns, same row counts, no `[object Object]`, no stack traces.

## 5. Fix loop

For each failure from step 4:

1. Compare with the baseline from step 0. Already failing on `main`: report, don't fix.
2. Find the bump that caused it (changelog, stack trace, or revert one track and rerun).
3. Fix our code to the new API. Keep fixes small and in the style of the surrounding code.
4. Re-run the failing gate, then the whole of step 4 once everything is green.
5. If the fix is large, needs an ESM conversion, or the upstream break looks like a bug that will be patched, **hold that package back** at its previous major instead of forcing it through. Never hold a package back silently.

Fixes go in the commit of the bump that required them, so every commit passes the gates on its own. Fixup that track's commit before pushing if a fix turns up later. After the PR is open, add fixes as normal commits.

## 6. Changelog

Under `## [next]` in `CHANGELOG.md`, add a `### Changed` line in the existing style: the new minimum Node version, "Bump npm packages to the latest version", and any held-back majors worth a user knowing about. Fold it into the last track's commit or commit it as `docs(changelog): note dependency updates`.

## 7. Open the pull request

Only open the PR once every check in step 4 is green, or every remaining failure is a baseline failure or a documented hold-back. If something is still broken and unexplained, stop and report.

### PR template

Read `.github/pull_request_template.md` fresh each run. If it's missing, check `.github/PULL_REQUEST_TEMPLATE.md` and `.github/PULL_REQUEST_TEMPLATE/`. If none exist, create `.github/pull_request_template.md` with: Summary (with `Closes #`), Type of change (checkboxes), Changes, How to test, Risk and rollback, and a Checklist of this repo's gates (`npm test`, `npm run lint`, `node bin/cf <cmd> --help` loads, CHANGELOG updated). Commit it alone as `docs(github): add pull request template` before creating the PR.

Keep every heading and checkbox in order; write "N/A" plus a few words when a section doesn't apply. Tick a box only when this run did the thing.

- **Summary**: two or three sentences on what moved, the new Node floor, and anything held back.
- **Changes**: the tables below.
- **How to test**: `npm ci && npm test && npm run lint` on floor and latest, plus the `--help` walk.
- **Risk and rollback**: the Node floor change (users on older Node can't install the next release), majors that went in, and "revert the merge" as the rollback.

```markdown
### Node and CI
| Component | From | To |
|---|---|---|

### Runtime dependencies
| Package | From | To | Major | Notes |
|---|---|---|---|---|

### Dev dependencies
| Package | From | To | Major | Notes |
|---|---|---|---|---|

### Breaking changes reviewed
| Package | Change | Impact on this repo | Fix |
|---|---|---|---|

### Held back
| Package | Stayed on | Latest | Reason | Unblocked by |
|---|---|---|---|---|

### Verification
| Check | Node <floor> | Node <latest> |
|---|---|---|
| `npm ci` (no legacy peer deps) | | |
| `npm test` | | |
| `npm run lint` | | |
| `npm audit --omit=dev` | | |
| `npm pack --dry-run` contents | | |
| `cf <cmd> --help` for every command | | |
| `cf config list` against fixture | | |
| Live read-only smoke tests | | |

### Superseded
<open Dependabot PRs and stale branches this replaces, with links, or "None">

### Pre-existing failures on main
<baseline failures from step 0, or "None">
```

Table rules:

- One row per package that changed. Packages already on latest go in a one-line "Already current: a, b, c" under the table.
- Versions come from `npm ls --depth=0` before and after, not from the ranges in `package.json`.
- "Major" is `yes` for a major bump or a minor bump on a `0.x` package. Link the changelog in Notes for every `yes` row.
- The Babel packages can share one row when they all moved to the same version.
- Drop the Breaking changes and Held back tables if they'd be empty and write "None" under the heading.

### Create it

1. `git push -u origin <branch>`.
2. Write the body to `<scratchpad>/pr-body.md` and run `gh pr create --base main --title "chore(deps): dependency maintenance YYYY-MM-DD" --body-file <scratchpad>/pr-body.md`.
3. `gh pr checks --watch`. If CI fails on something the local run didn't catch, fix it on the branch, push, and update the Verification table with `gh pr edit --body-file`.
4. Don't merge, and don't release. `npm version` pushes tags on its own (`postversion`), and creating a GitHub release triggers `npm-publish.yml`. Hand back the PR link with two lines: how many packages moved, and what was held back.
