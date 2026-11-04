## Summary

<!-- What does this change do, and why? Two or three sentences. -->

Closes #

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor (no behavior change)
- [ ] Dependency or infrastructure update
- [ ] Docs

## Changes

<!-- The notable changes, grouped by area (commands, classes, deps, ci...). Tables are welcome for version bumps. -->

-

## How to test

<!-- Steps a reviewer can follow. Include the cf commands to run and what they should print. -->

1. `npm ci && npm test && npm run lint`
2.

## Risk and rollback

<!-- What could break for people using the CLI, and how to undo it. Write "Low: revert the merge" if that is the whole story. -->

## Checklist

- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `node bin/cf <command> --help` loads for every command touched
- [ ] `CHANGELOG.md` updated under `## [next]` for user-facing changes
