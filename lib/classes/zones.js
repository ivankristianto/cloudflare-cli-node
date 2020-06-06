"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _config = require("../utils/config");

var _request = _interopRequireDefault(require("../utils/request"));

var Zones = /*#__PURE__*/function () {
  function Zones() {
    (0, _classCallCheck2["default"])(this, Zones);
  }

  (0, _createClass2["default"])(Zones, null, [{
    key: "list",
    value: function () {
      var _list = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var args,
            _args$status,
            status,
            _args$zoneName,
            zoneName,
            _args$order,
            order,
            _args$page,
            page,
            _args$perPage,
            perPage,
            _args$direction,
            direction,
            zonesApiUrl,
            response,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                args = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                _args$status = args.status, status = _args$status === void 0 ? 'active' : _args$status, _args$zoneName = args.zoneName, zoneName = _args$zoneName === void 0 ? '' : _args$zoneName, _args$order = args.order, order = _args$order === void 0 ? 'name' : _args$order, _args$page = args.page, page = _args$page === void 0 ? 1 : _args$page, _args$perPage = args.perPage, perPage = _args$perPage === void 0 ? 20 : _args$perPage, _args$direction = args.direction, direction = _args$direction === void 0 ? 'asc' : _args$direction;
                zonesApiUrl = new URL("".concat((0, _config.getRootApiURL)(), "zones"));

                if (zoneName) {
                  zonesApiUrl.searchParams.append('name', zoneName);
                }

                if (status) {
                  zonesApiUrl.searchParams.append('status', status);
                }

                if (order) {
                  zonesApiUrl.searchParams.append('order', order);
                }

                if (page) {
                  zonesApiUrl.searchParams.append('page', page.toString());
                }

                if (perPage) {
                  zonesApiUrl.searchParams.append('per_page', perPage.toString());
                }

                if (direction) {
                  zonesApiUrl.searchParams.append('direction', direction);
                }

                _context.next = 11;
                return (0, _request["default"])(zonesApiUrl.toString());

              case 11:
                response = _context.sent;

                if (!(response.success !== true)) {
                  _context.next = 14;
                  break;
                }

                throw new Error(response.errors[0].message);

              case 14:
                return _context.abrupt("return", response);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function list() {
        return _list.apply(this, arguments);
      }

      return list;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(zoneId) {
        var zonesApiUrl, response;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                zonesApiUrl = new URL("".concat((0, _config.getRootApiURL)(), "zones/").concat(zoneId));
                _context2.next = 3;
                return (0, _request["default"])(zonesApiUrl.toString());

              case 3:
                response = _context2.sent;

                if (!(response.success !== true)) {
                  _context2.next = 6;
                  break;
                }

                throw new Error(response.errors[0].message);

              case 6:
                return _context2.abrupt("return", response);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function get(_x) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }]);
  return Zones;
}();

var _default = Zones;
exports["default"] = _default;