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

var Filters = /*#__PURE__*/function () {
  function Filters() {
    (0, _classCallCheck2["default"])(this, Filters);
  }

  (0, _createClass2["default"])(Filters, null, [{
    key: "list",
    value: function () {
      var _list = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(zoneId) {
        var args,
            _args$page,
            page,
            _args$perPage,
            perPage,
            filterApiUrl,
            response,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                args = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                _args$page = args.page, page = _args$page === void 0 ? 1 : _args$page, _args$perPage = args.perPage, perPage = _args$perPage === void 0 ? 20 : _args$perPage;
                filterApiUrl = new URL("".concat((0, _config.getRootApiURL)(), "zones/").concat(zoneId, "/filters"));

                if (page) {
                  filterApiUrl.searchParams.append('page', page.toString());
                }

                if (perPage) {
                  filterApiUrl.searchParams.append('per_page', perPage.toString());
                }

                _context.next = 7;
                return (0, _request["default"])(filterApiUrl.toString());

              case 7:
                response = _context.sent;

                if (!(response.success !== true)) {
                  _context.next = 10;
                  break;
                }

                throw new Error(response.errors[0].message);

              case 10:
                return _context.abrupt("return", response);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function list(_x) {
        return _list.apply(this, arguments);
      }

      return list;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(zoneId, filterId) {
        var filterApiUrl, response;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                filterApiUrl = new URL("".concat((0, _config.getRootApiURL)(), "zones/").concat(zoneId, "/filters/").concat(filterId));
                _context2.next = 3;
                return (0, _request["default"])(filterApiUrl.toString());

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

      function get(_x2, _x3) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(zoneId, filterId) {
        var filterApiUrl, response;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                filterApiUrl = "".concat(_config.getRootApiURL, "zones/").concat(zoneId, "/filters/").concat(filterId);
                _context3.next = 3;
                return (0, _request["default"])(filterApiUrl.toString(), 'DELETE');

              case 3:
                response = _context3.sent;

                if (!(response.success !== true)) {
                  _context3.next = 6;
                  break;
                }

                throw new Error(response.errors[0].message);

              case 6:
                return _context3.abrupt("return", response);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function _delete(_x4, _x5) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }]);
  return Filters;
}();

var _default = Filters;
exports["default"] = _default;