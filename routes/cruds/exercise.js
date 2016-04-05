"use strict";

var _ = require('lodash');
var req;

function _get(object_id, callback) {
	global.connection.query('SELECT * FROM exercise WHERE id = $1', [object_id], 'Getting exercise to edit: ' + object_id, function (exercise, err) {
		if (err) {
			return callback();
		}
		return callback(exercise[0]);
	});
}

function _save(callback) {
	var name = req.body.name;
	var tags = req.body.tags;
	var weight, reps;
	if (req.body.exercise_type == 'reps') {
		reps = true;
		weight = false;
	} else {
		reps = false;
		weight = true;
	}

	var insert_query = 'INSERT INTO exercise (id, name, tags, by_reps, by_weight) VALUES (nextval(\'exercise_sequence\'), $1, $2, $3, $4) RETURNING id';
	global.connection.query(insert_query, [name, tags, reps, weight], "Inserting new exercise", function (exercise, err) {
		if (err) {
			return callback();
		}
		return callback(exercise[0]);
	});
}

function _update(callback) {
	var object_id = req.params.domainId;
	var name = req.body.name;
	var tags = req.body.tags;
	var weight, reps;
	if (req.body.exercise_type == 'reps') {
		reps = true;
		weight = false;
	} else {
		reps = false;
		weight = true;
	}

	var update_query = 'UPDATE exercise set name=$2, tags=$3, by_reps=$4, by_weight=$5 WHERE id = $1 returning id';
	global.connection.query(update_query, [object_id, name, tags, reps, weight], "Updating exercise", function (exercise, err) {
		if (err) {
			return callback();
		}
		return callback(exercise[0]);
	});
}

function _delete(callback) {
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

module.exports = function(request) {
	req = request;
	return {
		get					: _get,
		save				: _save,
		update				: _update,
		delete				: _delete,
		get_all				: _get_all,
	};
};