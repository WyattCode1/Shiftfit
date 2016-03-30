"use strict";

var _ = require('lodash');
var req;

function _get(objectId, callback) {
    console.info('Trying to get Shift with id ' + objectId);
    global.connection.query('SELECT * FROM shift WHERE id = $1', [objectId], 'Getting shift to edit', function (shift, err) {
        if (err) {
            return callback();
        }
        console.log(shift[0]);
        return callback(shift[0]);
    });
}

function _save(callback) {
    console.info("Inserting New shift");
    global.connection.query('INSERT INTO shift (id, name) VALUES (nextval(\'shift_sequence\'), $1) RETURNING id', [req.body.name], "Inserting new shift", function (shift, err) {
        if (err) {
            return callback();
        }
        return callback(shift[0]);
    });
}

function _update(callback) {
    global.connection.query('UPDATE shift set name = $2 WHERE id = $1 returning id', [req.params.domainId, req.body.name], "Updating shift", function (shift, err) {
        if (err) {
            return callback();
        }
        return callback(shift[0]);
    });
}

function _delete(callback) {
    global.connection.query('DELETE FROM shift WHERE id = $1 returning id', [req.params.domainId], "Deleting shift", function (shift, err) {
        if (err) {
            return callback();
        }
        return callback(shift[0].id);
    });
}

function _get_all(callback) {
    global.connection.query('SELECT * from shift', null, "Getting all shift", function (shift, err) {
        if (err) {
            return callback();
        }
        return callback(shift);
    });
}

module.exports = function(request) {
    req = request;
    return {
        get     : _get,
        save    : _save,
        update  : _update,
        delete  : _delete,
        get_all : _get_all
    };
};