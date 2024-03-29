# Changelog

All notable changes to this project will be documented in this file, per [the Keep a Changelog standard](https://keepachangelog.com/).

## [next]

## [0.7.0] - 2022-02-13

### Added
- Add new commands: `rules <create|update|delete|list>` to manage zones page rules.

## [0.6.0] - 2021-01-28

### Added
- Allow setting zones ssl, `cf zones settings ssl example.com [--value=full|flexible|strict|off]`.

### Changed
- Fix proxied value to boolean type.

## [0.5.0] - 2020-08-18

### Added
- Allow exporting zones list into csv file, `cf zones list --exportCsv=/path/to/file.csv`.
- Allow deleting dns with more than 1 record per command, `cf dns delete example.com dns1 dns2 dns3`.

### Changed
- Bump all npm packages to the latest version.

## [0.4.0] - 2020-07-29

### Added
- Add new commands: `config <add|delete|list|reset>` to manage api tokens.
- Add new feature: adding multiple access tokens, and use `useToken` argument to select the intended account.

### Changed
- Change dns update command, now only need to pass the dns record value that need to be changed.
- Change Config class directory to classes for better structure.

## [0.3.0] - 2020-07-21

### Added
- Add new command Zones > activation_check
- Allow filter zone list by account id
- Add `ora` package for spinner library
- Add spinner on every commands
- Add `disableSpinner` argument globally to disable spinner on a command

### Fixed
- Fix eslint configurations
- Fix build and test process on GitHub action

## [0.2.1] - 2020-07-20

### Changed
- Update some node package dependencies

## [0.2.0] - 2020-07-07

### Added
- Add new command: DNS > Update

### Changed
- Modify  default fields to firewall > get
- Update README file for contributing and documentation section

### Fixed
- Fix issue with proxied always true for dns records

## [0.1.1] - 2020-07-06

### Fixed
- Fix issue with babel/runtime on Windows env

## [0.1.0] - 2020-07-06

### Fixed
- Fix build process on GitHub action

### Added
- Add unit tests for utils functions

## [0.0.2] - 2020-07-03

### Added
- Add command: filters create
- Add command: zone settings always_use_https
- Add command: ips - list cloudflare IP

### Changed
- Add better log info when commands need arguments
- Enhance request interface to check response from fetch api

## [0.0.1] - 2020-06-15
- Initial release
