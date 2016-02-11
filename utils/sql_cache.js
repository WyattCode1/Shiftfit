'use strict';

var util = require('util');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var Semaphore = require("node-semaphore");
var pool = Semaphore(1);

function SqlCache(log, options) {
    var options = options || {};
    this.log = log;
    this._sql_cache = {};
    this.sql_dir = options.sql_dir  || 'sql';
    this.tasks = [];
    var self = this;

    this.process_files = function process_files(err, files) {
        if (err) return self.init_done(err);
        async.each(files, function (file, file_done) {
                try {
                    if (self.is_valid_sql_file(file)) {
                        self.tasks.push(function (callback) {
                            self.read_one_file(file, function (err, sql_info) {
                                if (err) callback(err);
                                callback(null, sql_info);
                            });
                        });
                    }
                    return file_done();
                } catch (err) {
                    return file_done(err);
                }},
            function (err) {
                if (err) return self.init_done(err);
                self.read_file_data();
            });
    };

    this.read_file_data = function read_file_data() {
        async.parallel(self.tasks, function (err, results) {
            if (err) return self.init_done(err);
            _.each(results, function (result) {
                _.merge(self._sql_cache, result);
            });
            return self.init_done();
        });
    };

    this.read_one_file = function read_one_file(file, callback) {
        fs.readFile(self.get_path(file), {encoding: 'utf8'}, function (err, data) {
            if (err) return callback(err);
            var key = self.query_key(file);
            var sql_info = {};
            sql_info[key] = data;
            return callback(null, sql_info);
        });
    };

    this.is_valid_sql_file = function(file) {
        return fs.lstatSync(self.get_path(file)).isFile() && /\.sql$/.test(file);
    };

    this.get_path = function get_path(file) {
        return path.join(this.sql_dir, file);
    };
}

SqlCache.prototype.init = function (done) {
    this.init_done = done;
    try {
        fs.readdir(this.sql_dir, this.process_files);
    } catch (err) {
        return this.init_done(err);
    }
};

SqlCache.prototype.query_key = function(query) {
    return query.replace(/\.sql$/, '');
};

SqlCache.prototype.get = function(query) {
    return this._sql_cache[this.query_key(query)];
};

SqlCache.prototype.has = function(query) {
    return _.has(this._sql_cache, this.query_key(query));
};


module.exports = function(log) {
    var sql_cache = new SqlCache(log);
    pool.acquire(function() {
        sql_cache.init(function(err) {
            if (err) {
                log.error("Initialization failed");
            }
            pool.release();
        });
    });
    return {
        get: function(query) {
            return sql_cache.get(query);
        },
        has: function(query) {
            return sql_cache.has(query);
        }
    };
};
