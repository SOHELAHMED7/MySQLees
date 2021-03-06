"use strict"; // Dependencies

var _runtime = _interopRequireDefault(require("./dependencies/runtime"));

var _mysql = _interopRequireDefault(require("mysql"));

var _Model = _interopRequireDefault(require("./lib/Model"));

var _Store = _interopRequireDefault(require("./lib/Store"));

var _Schema = _interopRequireDefault(require("./lib/Schema"));

var _DataTypes = _interopRequireDefault(require("./lib/DataTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MySQLees = /*#__PURE__*/function () {
  function MySQLees() {
    _classCallCheck(this, MySQLees);
  }

  _createClass(MySQLees, null, [{
    key: "init",
    value: function init() {
      if (!_Store["default"].init) {
        _Store["default"].init = true;
        _Store["default"].options = {};
        _Store["default"].models = new Map(); // Satic Variables for MySQLess

        MySQLees.dataType = _DataTypes["default"];
        MySQLees.Model = _Model["default"]; // Binding official MySQL package

        _Store["default"].mysql = _mysql["default"];
      }
    }
  }, {
    key: "model",
    value: function model(modelName, schema) {
      // schema.implementSchema(modelName);
      var model = new _Model["default"](schema);
      model.modelName = modelName;
      model.schema = schema.schema;
      return model;
    }
  }, {
    key: "schema",
    value: function schema(_schema) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new _Schema["default"](_schema, options);
    }
  }, {
    key: "options",
    value: function options() {
      var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _Store["default"].options = _options;
    }
  }, {
    key: "createConnection",
    value: function createConnection(config) {
      if (!_Store["default"].mysql) {
        console.error('Error: Failed to bind MySQL!!');
        process.exit();
      } // MySQL Connection Variables


      _Store["default"].isConnected = true;
      _Store["default"].isPool = false;
      _Store["default"].config = config;
      _Store["default"].connection = _Store["default"].mysql.createConnection(config);

      _Store["default"].connection.connect(function (err) {
        if (err) console.error(err);
      });

      return _Store["default"].connection;
    }
  }, {
    key: "createPool",
    value: function createPool(config) {
      if (!_Store["default"].mysql) {
        console.error('Error: Failed to bind MySQL!!');
        process.exit();
      } // MySQL Connection Variables


      _Store["default"].isConnected = true;
      _Store["default"].isPool = true;
      _Store["default"].config = config;
      _Store["default"].connection = _Store["default"].mysql.createPool(config);
      return _Store["default"].connection;
    }
  }, {
    key: "getConnection",
    value: function getConnection() {
      return new Promise(function (resolve, reject) {
        if (_Store["default"].isPool) {
          // Pull connection from connection pool
          _Store["default"].connection.getConnection(function (err, connection) {
            if (err) reject(err);
            resolve(connection);
          });
        } else {
          reject(new Error('Failed to get connection from pool, please use createPool() method for connection pooling.'));
        }
      });
    }
  }, {
    key: "connection",
    value: function connection() {
      if (_Store["default"].isPool) {
        return null;
      }

      return _Store["default"].connection;
    }
  }, {
    key: "pool",
    value: function pool() {
      if (_Store["default"].isPool) {
        return _Store["default"].connection;
      }

      return null;
    }
  }, {
    key: "mysql",
    value: function mysql() {
      return _Store["default"].mysql;
    }
  }, {
    key: "escape",
    value: function escape(value) {
      return _Store["default"].mysql.escape(value);
    }
  }, {
    key: "escapeId",
    value: function escapeId(value) {
      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (param) {
        return _Store["default"].mysql.escapeId(value, param);
      }

      return _Store["default"].mysql.escapeId(value);
    }
  }, {
    key: "query",
    value: function query(stmt) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var connection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return new Promise(function (resolve, reject) {
        if (!connection) {
          connection = _Store["default"].connection;
        }

        connection.query(stmt, params, function (error, result) {
          if (error) reject(error);
          resolve(result);
        });
      });
    }
  }]);

  return MySQLees;
}();

MySQLees.init();
module.exports = MySQLees;