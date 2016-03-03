"use strict";

var express_validator = require('express-validator');

module.exports = function(app) {
    app.use(express_validator({
        customValidators: {
            gte: function(param, num) {
                return param >= num;
            },
            date_comparator: function(param, date1, date2) {
                return date2 > date1;
            },
            empty: function(param) {
                return (param && param.length > 0);
            },
            not_zero: function(param) {
                return param != 0;
            },
            is_url: function(param) {
                var url_regex = /^(((https?\:\/\/)|(www\.))[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*.((\w{1,4})|(\W{1})))$/;
                return url_regex.test(param);
            },
            is_valid_webinar: function(param) {
                var webinar_regex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
                return  webinar_regex.test(param);
            }
        }
    }));
};