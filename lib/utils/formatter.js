"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _cliTable = _interopRequireDefault(require("cli-table"));

var _lodash = require("lodash");

var _logger = _interopRequireDefault(require("./logger"));

var formatter = /*#__PURE__*/function () {
  function formatter() {
    (0, _classCallCheck2["default"])(this, formatter);
  }

  (0, _createClass2["default"])(formatter, null, [{
    key: "toTable",

    /**
     * Format the output with table format
     *
     * @param {string} fields Table head, comma separated
     * @param {Array} rows Rows of the data
     *
     * @returns {string}
     */
    value: function toTable(fields, rows) {
      var table = new _cliTable["default"]({
        head: fields.split(',')
      });
      rows.forEach(function (row) {
        table.push(row);
      });

      _logger["default"].success(table.toString());
    }
    /**
     * Format the output as defined separator
     *
     * @param {Array} rows Rows of the data
     * @param {string} separator Separator, default a space
     */

  }, {
    key: "toString",
    value: function toString(rows) {
      var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

      _logger["default"].success(rows.join(separator));
    }
    /**
     * Format the output as JSON
     *
     * @param {Array} rows Rows of the data
     * @param {string} separator Separator, default a space
     */

  }, {
    key: "toJson",
    value: function toJson(rows) {
      _logger["default"].success(JSON.stringify(rows));
    }
  }]);
  return formatter;
}();

var _default = formatter;
exports["default"] = _default;