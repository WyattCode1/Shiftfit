"use strict";

var _ = require('lodash');

function _get(objectId, callback) {
    console.info('Trying to get Box with id ' + objectId);
    global.connection.query('SELECT * FROM box WHERE id = $1', [objectId], 'Getting box to edit', function (box, err) {
        if (err) {
            return callback();
        }
        console.log(box[0]);
        return callback(box[0]);
    });
}

function _save(req, callback) {
    console.info("Inserting New box");
    global.connection.query('INSERT INTO box (id, name) VALUES (nextval(\'box_sequence\'), $1) RETURNING id', [req.body.name], "Inserting new box", function (box, err) {
        if (err) {
            return callback();
        }
        return callback(box[0]);
    });
}

function _update(req, callback) {
    console.info("Updating a box with id= " + req.params.domainId);
    global.connection.query('UPDATE box set name = $2 WHERE id = $1 returning id', [req.params.domainId, req.body.name], "Updating box", function (box, err) {
        if (err) {
            return callback();
        }
        return callback(box[0]);
    });
}

function _delete(req, callback) {
    global.connection.query('DELETE FROM box WHERE id = $1 returning id', [req.params.domainId], "Deleting box", function (box, err) {
        if (err) {
            return callback();
        }
        return callback(box[0].id);
    });
}

function _get_all(callback) {
    global.connection.query('SELECT * from box', null, "Getting all box", function (box, err) {
        if (err) {
            return callback();
        }
        return callback(box);
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