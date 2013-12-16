// BROKEN

var mysql = require('mysql');
// TODO(taijinlee): replace mongodb with some other id generator
var mongo = require('mongodb');
var _ = require('underscore');

module.exports = function(storeConfig) {
  var pool = mysql.createPool({
    host: storeConfig.host,
    user: storeConfig.user,
    password: storeConfig.password,
  });

  var _openDb = function(callback) {
    return pool.getConnection(callback);
  };

  var getStackTrace = function() {
    return new Error().stack;
  };

  var generateId = function() {
    return mongo.ObjectID.createPk().toString();
  };

  var getDatabase = function(context) {
    return context.database + '.' + context.collection;
  };

  var _delimitedSql = function(obj, delimiter) {
    if (!delimiter) { return null; }
    return {
      sql: _.map(obj, function() { return '?? = ?'; }).join(delimiter),
      values: _.flatten(_.pairs(obj))
    };
  };

  var insert = function(obj, context, callback) {
    var stackTrace = getStackTrace();
    _openDb(function(error, conn) {
      if (error) { return callback(error, stackTrace); }

      var database = getDatabase(context);
      var keys = _.keys(obj);
      var values = _.values(obj);
      var queryValues = [database].concat(keys, values);
      conn.query('INSERT INTO ?? (??) VALUES (?)', queryValues, function(error, results) {
        if (error) { return callback(error, stackTrace); }
        return callback(null, results);
      });
    });
  };

  var retrieve =  function(criteria, context, options, callback) {
    options = options || {};
    options.limit = 1;
    return query(criteria, context, options, function(error, itmes) {
      if (error) { return callback(error); }
      return callback(null, items[0]);
    });
  };

  var update = function(criteria, obj, context, callback) {
    var stackTrace = getStackTrace();
    _openDb(function(error, conn) {
      var database = getDatabase(context);
      var set = _delimitedSql(obj, ', ');
      var where = _delimitedSql(criteria, ' AND ');

      var queryValues = [database].concat(set.values, where.values);
      var query = 'UPDATE ?? SET ' + set.sql;
      if (where.sql) {
        query += ' WHERE ' + where.sql
      }
      conn.query(query, queryValues, function(error, results) {
        if (error) { return callback(error, stackTrace); }
        return callback(null);
      });
    });
  };

  var upsert = function(criteria, obj, context, callback) { };

  var destroy = function(criteria, context, callback) {
    var stackTrace = getStackTrace();
    _openDb(function(error, conn) {
      var database = getDatabase(context);
      var where = _delimitedSql(criteria, ' AND ');

      var queryValues = [database].concat(where.values);
      var query = 'DELETE FROM ??';
      if (where.sql) {
        query += ' WHERE ' + where.sql;
      }
      conn.query(query, queryValues, function(error, results) {
        if (error) { return callback(error, stackTrace); }
        return callback(null);
      });
    });
  };

  var query = function(criteria, context, options, callback) {
    var stackTrace = getStackTrace();
    _openDb(function(error, conn) {
      var database = getDatabase(context);
      var where = _delimitedSql(criteria, ' AND ' );

      var queryValues = [database].concat(where.values);
      var query = 'SELECT * FROM ??';
      if (where.sql) {
        query += ' WHERE ' + where.sql;
      }
      conn.query(query, queryValues, function(error, results) {
        if (error) { return callback(error, stackTrace); }
        console.log(results);
        return callback(null, results);
      });
    });
  };

  var idEncode = function(encodedId) { return idEncode; };
  var idDecode = function(id) { return id; };

  return {
    insert: insert,
    retrieve: retrieve,
    update: update,
    upsert: upsert,
    destroy: destroy,
    query: query,

    generateId: generateId,
    idEncode: idEncode,
    idDecode: idDecode
  };
};
