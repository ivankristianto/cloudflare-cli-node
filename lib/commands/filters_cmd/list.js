"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = require("lodash");

var _filters = _interopRequireDefault(require("../../classes/filters"));

var _logger = _interopRequireDefault(require("../../utils/logger"));

var _formatter = _interopRequireDefault(require("../../utils/formatter"));

exports.command = 'list <zoneId>';
exports.desc = 'List of filters';
exports.builder = {
  zoneId: {
    describe: 'Zone ID',
    type: 'string'
  },
  fields: {
    "default": 'id,expression',
    describe: 'Fields to return',
    type: 'string'
  },
  format: {
    "default": 'table',
    describe: 'Format the output, value: table, string, json',
    type: 'string'
  },
  separator: {
    "default": ' ',
    describe: 'Separator value when the output format is string',
    type: 'string'
  },
  perPage: {
    "default": 20,
    describe: 'Number of zones per page',
    type: 'integer'
  },
  page: {
    "default": 1,
    describe: 'Page number of paginated results',
    type: 'integer'
  }
};

exports.handler = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(argv) {
    var fields, separator, perPage, page, zoneId, format, requestArgs, response, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            fields = argv.fields, separator = argv.separator, perPage = argv.perPage, page = argv.page, zoneId = argv.zoneId;
            format = argv.format;

            if (fields === 'id') {
              format = 'string';
            }

            requestArgs = {
              perPage: perPage,
              page: page
            };
            _context.next = 7;
            return _filters["default"].list(zoneId, requestArgs);

          case 7:
            response = _context.sent;
            results = (0, _lodash.map)(response.result, function (item) {
              var output = [];
              fields.split(',').forEach(function (field) {
                output.push(item[field] ? item[field] : '');
              });
              return output;
            });
            _context.t0 = format;
            _context.next = _context.t0 === 'json' ? 12 : _context.t0 === 'string' ? 14 : _context.t0 === 'table' ? 16 : 16;
            break;

          case 12:
            _formatter["default"].toJson(results);

            return _context.abrupt("break", 18);

          case 14:
            _formatter["default"].toString(results, separator);

            return _context.abrupt("break", 18);

          case 16:
            _formatter["default"].toTable(fields, results);

            return _context.abrupt("break", 18);

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t1 = _context["catch"](0);

            _logger["default"].error(_context.t1);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 20]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();