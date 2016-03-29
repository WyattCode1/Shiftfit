'use strict';

var _ = require('lodash');

function _get(req, res) {
    console.info('Exercises autocomplete: ' + req.params.key);
    var key = req.params.key + '%';
    global.connection.query("SELECT name as exercise FROM exercise WHERE LOWER(name) LIKE LOWER($1)", [key], 'Getting exercise by autocomplete', function(exercise, err) {
        if (err) {
            return res.status(500).send();
        } else {
            return res.status(200).send(exercise);
        }
    });
}

module.exports = function () {
    return {
        register : function (app) {
            app.login_get('/exerciseautocomplete/:key', _get);
        }
    };
};