"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _yargs = _interopRequireDefault(require("yargs"));

var _logger = _interopRequireDefault(require("./utils/logger"));

/**
 * Internal dependencies
 */
// eslint-disable-next-line consistent-return
function main() {
  try {
    return _yargs["default"].commandDir('commands').demandCommand().help().argv;
  } catch (e) {
    _logger["default"].error(e.toString());
  }
}

main();