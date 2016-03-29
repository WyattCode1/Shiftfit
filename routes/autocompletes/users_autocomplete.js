'use strict';

var _ = require('lodash');

function _get(req, res) {
    console.info('User autocomplete: ' + req.params.key);
    var key = req.params.key + '%';
    global.connection.query("SELECT email as user FROM shiftfit_user WHERE LOWER(email) LIKE LOWER($1)", [key], 'Getting shiftfit user autocomplete', function(user, err) {
        if (err) {
            return res.status(500).send();
        } else {
            return res.status(200).send(user);
        }
    });
}

module.exports = function () {
    return {
        register : function (app) {
            app.admin_get('/userautocomplete/:key', _get);
        }
    };
};