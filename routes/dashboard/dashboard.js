'use strict'

var _ = require('lodash');

function _get(req, res) {
    console.info('Loading dashboard');
    res.sendPage("dashboard");
}

module.exports = function () {
    return {
        register : function (app) {
            app.get('/dashboard', _get);
        }
    }
};