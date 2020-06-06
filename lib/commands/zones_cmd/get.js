"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _zones = _interopRequireDefault(require("../../classes/zones"));

var _logger = _interopRequireDefault(require("../../utils/logger"));

var _formatter = _interopRequireDefault(require("../../utils/formatter"));

exports.command = 'get <zoneId>';
exports.desc = 'Get detail of a zone';
exports.builder = {
  zoneId: {
    describe: 'Zone ID',
    type: 'string'
  },
  fields: {
    "default": 'id,name,status,name_servers',
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
  }
};

exports.handler = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(argv) {
    var fields, separator, zoneId, format, response, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            fields = argv.fields, separator = argv.separator, zoneId = argv.zoneId;
            format = argv.format;

            if (fields === 'id') {
              format = 'string';
            }

            _context.next = 6;
            return _zones["default"].get(zoneId);

          case 6:
            response = _context.sent;
            results = [];
            fields.split(',').forEach(function (field) {
              results.push(response.result[field]);
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
            _formatter["default"].toTable(fields, [results]);

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