"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _chalk = _interopRequireDefault(require("chalk"));

/**
 * External dependencies
 */
var colorScheme = {
  success: _chalk["default"].green,
  info: _chalk["default"].white,
  warning: _chalk["default"].yellow,
  error: _chalk["default"].red,
  debug: _chalk["default"].blue
};

function log(scheme) {
  var _console;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  (_console = console).log.apply(_console, (0, _toConsumableArray2["default"])(args.map(function (arg) {
    return colorScheme[scheme](arg);
  })));
}

function success() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  log.apply(void 0, ['success'].concat(args));
}

function info() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  log.apply(void 0, ['info'].concat(args));
}

function warning() {
  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  log.apply(void 0, ['warning'].concat(args));
}

function error() {
  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  log.apply(void 0, ['error'].concat(args));
}

function debug() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  log.apply(void 0, ['debug'].concat(args));
}

var _default = {
  success: success,
  info: info,
  warning: warning,
  debug: debug,
  error: error
};
exports["default"] = _default;