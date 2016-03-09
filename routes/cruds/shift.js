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

function _save(req, callback) {
    global.connection.query('INSERT INTO shift (id, name) VALUES (nextval(\'shift_sequence\'), $1) RETURNING id', [req.body.name], "Inserting new shift", function (res, err){
        if (err) {
            return callback();
        }
        return callback(res[0]);
    });
}

function _update(req, callback) {
    global.connection.query('UPDATE shift set name = $2 WHERE id = $1 returning id', [req.params.objectId, req.body.name], "Updating shift", function (res, err){
        if (err) {
            return callback();
        }
        return callback(res[0]);
    });
}

module.exports = function() {
    return {
        get     : _get,
        save    : _save,
        update  : _update
    };
};