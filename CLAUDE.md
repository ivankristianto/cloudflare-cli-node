# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`cloudflare-cli-node` is a yargs-based CLI (`cf`) for the Cloudflare v4 API. Source is ES modules in `src/`, compiled by Babel to `lib/` (gitignored). `bin/cf` requires `lib/cli`, so nothing runs until you build.

## Commands

```sh
npm run build      # clean + babel src -> lib
npm run watch      # rebuild on change
npm run lint       # eslint src test (flat config in eslint.config.js)
npm test           # builds first, then mocha --recursive over test/
```

Run a single test file or case (build first, since tests import from `lib/`):

```sh
npm run build && npx mocha --require @babel/register test/utils/formatter.js
npx mocha --require @babel/register --recursive -g "mappingFields"
```

Try the CLI locally with `node bin/cf <command>` after a build, or `npm link` to get `cf` on PATH. CI (`.github/workflows/build-and-test.yml`) runs `npm ci`, `npm test` and `npm run lint` on Node 22.18.0 and 26. The floor is Node 22.18 (`engines`, and pinned exactly in the CI matrix). chalk, ora, inquirer and node-fetch are ESM-only and load through `require(esm)`, and Babel 8 itself needs 22.18.

`cf firewall` and `cf filters` fail with `*.api.deprecated`: Cloudflare retired those APIs in favour of Rulesets (seen 2026-11). They need porting, not a dependency bump.

## Architecture

**Command tree.** `src/cli.js` calls `yargs.commandDir('commands')` and defines the global flags `--disableSpinner`, `--verbose` and `--useToken`. Each top-level file in `src/commands/` (e.g. `dns.js`) is a yargs command module whose `builder` calls `commandDir('<name>_cmd')` to load its subcommands. Nesting goes deeper the same way: `zones_cmd/settings.js` loads `zones_cmd/settings_cmd/`. The user command is an exception to the naming: `user.js` loads `users_cmd/`. To add a subcommand, drop a file in the right `*_cmd/` folder; no registration needed.

**Subcommand shape.** Each subcommand exports `command`, `desc`, `builder`, and `handler = withSpinner(runCommand)`. `runCommand(argv)` sets `argv.spinner.text`, calls a static method on an API class, then pipes the result through `formatter`. `withSpinner` (`src/utils/withSpinner.js`) owns the ora spinner, prints success or failure, and calls `process.exit`. With `--disableSpinner` it passes a plain `{}` as `spinner`, so setting `.text` is harmless.

**API classes** (`src/classes/`). All are classes of static methods. Inheritance: `Request` (node-fetch wrapper, Bearer auth from `Config.getAuthToken()`) -> `Cloudflare` (base URL, `buildApiURL`, `optionalParams` for pagination/order, name-to-ID helpers) -> resource classes (`DNS`, `Zones`, `Firewall`, `Filters`, `Rules`, ...). Resource methods check `response.success !== true` and throw `response.errors[0].message`.

**Name-to-ID resolution shells out to the CLI itself.** `Cloudflare.convertZoneNameToId` and `convertRecordNameToId` run `execSync('cf zones list --zoneName=... --fields=id --disableSpinner ...')` and `cf dns list ...`. So a zone or record argument can be either a name or an ID, but this only works when a `cf` binary built from current code is on PATH. If name lookups behave oddly during development, check which `cf` is being invoked.

**Config and tokens.** `Config` reads and writes `~/.cloudflare-config` (JSON: `apiToken` plus an `accounts` array of named tokens). `--useToken=<name>` selects a token from `accounts` by name. `Config` and `Cloudflare` read `yargs.argv` directly rather than receiving args, so global flags leak into the class layer this way.

**Output.** `formatter.commandArgs()` supplies the shared `--format` (`table`, `string`, `json`, `list`) and `--separator` options. `mappingFields` turns an array of API objects into rows for list commands; `mappingField` handles a single object and supports dotted paths via `getDeep`. List commands switch to `string` format when `--fields=id`, which is what makes piping into `xargs` work (see `HOWTO.md`).

## Tests

Tests live in `test/utils/` and cover only the utilities and `Config`, importing from `lib/`. `Config` tests stub `Config.getConfigFile` with sinon and copy `test/fixtures/config/` into a temp dir. There are no tests for commands or API classes.

## Reference

`HOWTO.md` lists example invocations for every command, including the `xargs` pipeline pattern. Full command docs are in the project wiki: https://github.com/ivankristianto/cloudflare-cli-node/wiki
