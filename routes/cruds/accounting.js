"use strict";

var _ = require('lodash');

function _get(objectId, callback) {
    console.info('Trying to get Acconting with id ' + objectId);
    global.connection.query('SELECT * FROM accounting WHERE id = $1', [objectId], 'Getting accounting to edit', function (accounting, err) {
        if (err) {
            return callback();
        }
        return callback(accounting[0]);
    });
}

function _save(req, callback) {
    console.info("Inserting New accounting");
    global.connection.query('INSERT INTO accounting (id, name) VALUES (nextval(\'accounting_sequence\'), $1) RETURNING id', [req.body.name], "Inserting new accounting", function (accounting, err) {
        if (err) {
            return callback();
        }
        return callback(accounting[0]);
    });
}

function _update(req, callback) {
    global.connection.query('UPDATE accounting set name = $2 WHERE id = $1 returning id', [req.params.domainId, req.body.name], "Updating accounting", function (accounting, err) {
        if (err) {
            return callback();
        }
        return callback(accounting[0]);
    });
}

function _delete(req, callback) {
    global.connection.query('DELETE FROM accounting WHERE id = $1 returning id', [req.params.domainId], "Deleting accounting", function (accounting, err) {
        if (err) {
            return callback();
        }
        return callback(accounting[0].id);
    });
}

function _get_all(callback) {
    global.connection.query('SELECT * from accounting', null, "Getting all accountings", function (accounting, err) {
        if (err) {
            return callback();
        }
        return callback(accounting);
    });
}

module.exports = function() {
    return {
        get     : _get,
        save    : _save,
        update  : _update,
        delete  : _delete,
        get_all : _get_all
    };
};