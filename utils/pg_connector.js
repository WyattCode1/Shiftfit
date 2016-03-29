"use strict";

var pg = require('pg');
var log;

function PgConnector(conf, log, sql_cache) {
    this.config = conf;
    this.log = log;
    this.timer = {};
    this.sql_cache = sql_cache;
    this.time = function time(label) {
        this.timer[label] = Date.now();
    };

    this.timeEnd = function timeEnd(label) {
        var duration = Date.now() - this.timer[label];
        this.log.info('%s: %dms', label, duration);
    };

    this.do_search = function do_search(query, params, label, callback) {
        var self = this;
        pg.connect(this.config.postgresql, function (error, client, done) {
            if (error) {
                self.log.error('Could not connect to database', error);
                return callback({}, error);
            }
            var query_exec = client.query(query, params, function (error, result) {
                self.timeEnd(label);
                if (error) {
                    self.log.error('Error returning query: ' + label, error);
                    return callback({}, error);
                }
                done();
                return callback(result.rows);
            });
        });
    };
}

PgConnector.prototype.query = function(query, params, label, callback, orderby, ascending) {
    var sql = query;
    if (this.sql_cache.has(query)) {
        sql = this.sql_cache.get(query);
    }
    this.time(label);
    console.debug('Executing sql: ' + sql);
    return this.do_search(sql, params, label, callback);
};

module.exports = function(conf, sql_cache_options) {
    log = console;
    var sql_cache = require('./sql_cache.js')(console);;
    return new PgConnector(conf, log, sql_cache);
};
