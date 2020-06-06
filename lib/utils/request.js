"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = request;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _config = require("./config");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function defaultHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: "Bearer ".concat((0, _config.getAuthToken)())
  };
}

function request(_x) {
  return _request.apply(this, arguments);
}

function _request() {
  _request = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url) {
    var method,
        body,
        headersOpt,
        headers,
        opts,
        response,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            method = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'GET';
            body = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
            headersOpt = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            headers = _objectSpread(_objectSpread({}, defaultHeaders()), headersOpt);
            opts = {
              method: method,
              headers: headers
            };

            if (method === 'POST' || method === 'PUT') {
              opts.body = JSON.stringify(body);
            }

            _context.next = 8;
            return (0, _nodeFetch["default"])(url, opts);

          case 8:
            response = _context.sent;
            return _context.abrupt("return", response.json());

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _request.apply(this, arguments);
}