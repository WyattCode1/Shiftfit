'use strict'

var _ = require('lodash');

function _setNewSession(hash, user_id, callback) {
    global.connection.query('INSERT INTO shiftfit_user_session (session_hash, device, shiftfit_user_id) VALUES ($1, $2, $3)', [hash, 'WEB', user_id], 'Saving session', function(result, err) {
        if (err) {
            console.error('Error saving session');
            return callback(err);
        }
        return callback();
    });
}

module.exports = function () {
    return {
        setNewSession : _setNewSession
    }
};