"use strict";

var _ = require('lodash');


function lookup(config, str) {
    var str_to_url = {
        'delete_box_user': config.secure_app_url + '/delete_box_user'
    };
    return str_to_url[str];
}

function javascript(str, assets_url) {
    if(!str) {
        return null;
    }
    if(str.search(JAVASCRIPT_REGEX) === -1) {
        return null;
    }
    return assets_url + '/js/' + str;
}

function _currenttime() {
    var d = new Date();
    var n = d.getTime();
    return n;
}

module.exports = function(env) {
    var config = _.reduce(
        env,
        function(config, value, key) {
            var match = key.match(/^npm_package_config_(.+)/);
            var ignore = /^(?:stop|start)$/;
            if(!match) {
                return config;
            }
            var new_key = match[1];
            if(new_key.search(ignore) !== -1) {
                return config;
            }
            config[new_key] = value;
            return config;
        },
        {}
    );
    var images_urls = _.sortBy(
        _.filter(config, function(value, key) {
            if(key.search(/^images_urls_\d+$/) !== -1) {
                return value;
            }
        })
    );
    config.currenttime = _currenttime;

    config.url = function() {
        var head = arguments[0];
        var tail = _.toArray(arguments).slice(1).join('');
        return (
                lookup(config, head)
            ) + tail;
    };

    return config;
};
