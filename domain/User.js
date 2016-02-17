'use strict'

var _ = require('lodash');

function _getUserByEmail(email, callback) {
    global.connection.query('SELECT * FROM shiftfit_user where email = $1', [email], 'Getting user by email', function(user, err) {
        if (err) {
            console.error(err.message);
            return callback();
        }
        return callback(user[0]);

    });
}

module.exports = function () {
    return {
        getUserByEmail : _getUserByEmail
    }
};