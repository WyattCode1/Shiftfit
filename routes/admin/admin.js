'use strict';

var _ = require('lodash');

function _get(req, res) {
    console.info('Loading admin');
    res.sendPage("admin");
}

module.exports = function () {
    return {
        register : function (app) {
            app.admin_get('/admin', _get);
        }
    };
};