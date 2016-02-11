'use strict'

var _ = require('lodash');

function _get(req, res) {
    console.info('Loading home');
    res.sendPage("home");
}

module.exports = function () {
    return {
        register : function (app) {
            app.get('/home', _get);
        }
    }
};