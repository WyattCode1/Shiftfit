"use strict";

var _ = require('lodash');

function _get(object_id, callback) {
    global.connection.query('SELECT * FROM exercise WHERE id = $1', [object_id], 'Getting exercise to edit: ' + object_id, function (exercise, err) {
        if (err) {
            return callback();
        }
        return callback(exercise[0]);
    });
}

function _save(req, callback) {
	var name = req.body.name;
	var tags = req.body.tags;

	var insert_query = 'INSERT INTO exercise (id, name, tags) VALUES (nextval(\'exercise_sequence\'), $1, $2) RETURNING id';
    global.connection.query(insert_query, [name, tags], "Inserting new exercise", function (exercise, err) {
        if (err) {
            return callback();
        }
        return callback(exercise[0]);
    });
}

function _update(req, callback) {
	var object_id = req.params.domainId;
	var name = req.body.name;
	var tags = req.body.tags;

	var update_query = 'UPDATE exercise set name=$2, tags=$3 WHERE id = $1 returning id';
    global.connection.query(update_query, [object_id, name, tags], "Updating exercise", function (exercise, err) {
        if (err) {
            return callback();
        }
        return callback(exercise[0]);
    });
}

function _delete(req, callback) {
    global.connection.query('DELETE FROM exercise WHERE id = $1 returning id', [req.params.domainId], "Deleting exercise", function (exercise, err) {
        if (err) {
            return callback();
        }
        return callback(exercise[0].id);
    });
}

function _get_all(callback) {
    global.connection.query('SELECT * from exercise ORDER BY name', null, "Getting all exercise", function (exercise, err) {
        if (err) {
            return callback();
        }
        return callback(exercise);
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