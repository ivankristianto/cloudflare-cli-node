"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = require("lodash");

var _zones = _interopRequireDefault(require("../../classes/zones"));

var _logger = _interopRequireDefault(require("../../utils/logger"));

var _formatter = _interopRequireDefault(require("../../utils/formatter"));

exports.command = 'list';
exports.desc = 'List of zones';
exports.builder = {
  fields: {
    "default": 'id,name,status',
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
  },
  order: {
    "default": 'name',
    describe: 'Field to order zones by',
    type: 'string'
  },
  direction: {
    "default": 'asc',
    describe: 'Direction to order zones',
    type: 'string'
  },
  status: {
    "default": 'active',
    describe: 'Status of the zone',
    type: 'string'
  },
  zoneName: {
    "default": '',
    describe: 'A domain name',
    type: 'string'
  }
};

exports.handler = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(argv) {
    var fields, separator, perPage, page, order, direction, status, zoneName, format, requestArgs, response, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            fields = argv.fields, separator = argv.separator, perPage = argv.perPage, page = argv.page, order = argv.order, direction = argv.direction, status = argv.status, zoneName = argv.zoneName;
            format = argv.format;

            if (fields === 'id') {
              format = 'string';
            }

            requestArgs = {
              perPage: perPage,
              page: page,
              order: order,
              direction: direction,
              status: status
            };

            if (zoneName) {
              requestArgs.zoneName = zoneName;
            }

            _context.next = 8;
            return _zones["default"].list(requestArgs);

          case 8:
            response = _context.sent;
            results = (0, _lodash.map)(response.result, function (item) {
              var output = [];
              fields.split(',').forEach(function (field) {
                output.push(item[field] ? item[field] : '');
              });
              return output;
            });
            _context.t0 = format;
            _context.next = _context.t0 === 'json' ? 13 : _context.t0 === 'string' ? 15 : _context.t0 === 'table' ? 17 : 17;
            break;

          case 13:
            _formatter["default"].toJson(results);

            return _context.abrupt("break", 19);

          case 15:
            _formatter["default"].toString(results, separator);

            return _context.abrupt("break", 19);

          case 17:
            _formatter["default"].toTable(fields, results);

            return _context.abrupt("break", 19);

          case 19:
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t1 = _context["catch"](0);

            _logger["default"].error(_context.t1);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 21]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();