"use strict";

var _ = require('lodash');

function _get(objectId, callback) {
    console.info('Trying to get Shift with id ' + objectId);
    global.connection.query('SELECT * FROM shift WHERE id = $1', [objectId], 'Getting shift to edit', function (shift, err) {
        if (err) {
            return callback();
        }
        console.log(shift[0]);
        return callback(shift[0]);
    })
}

function _save() {
    global.connection.query('INSERT INTO shift ');
}

module.exports = function() {
    return {
        get     : _get,
        save    : _save
    };
};