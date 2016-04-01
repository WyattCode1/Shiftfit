"use strict";

var _ = require('lodash');
var req;

function _get(object_id, callback) {
    global.connection.query('select_weight_by_id', [object_id], 'Getting weight to edit: ' + object_id, function (weight, err1) {
        if (err1) {
            return callback();
		}
		return callback(weight[0]);
    });
}

function _save(callback) {
	var exercise_name = req.body.exercise_name;
	var amount = req.body.amount;
	var date = req.body.date;
	var unbroken = (req.body.unbroken == 'on');
	var user_id = req.body.user_id;

    global.connection.query('SELECT id FROM exercise WHERE lower(name) = lower($1)', [exercise_name], "getting exercise id", function (data, err) {
        if (err) {
            return callback();
        }
        if (data[0]) {
	    	var insert_query = 'INSERT INTO weight (id, exercise_id, amount, date, unbroken, user_id) VALUES (nextval(\'weight_sequence\'), $1, $2, $3, $4, $5) RETURNING id';
	    	global.connection.query(insert_query, [data[0].id, amount, date, unbroken, user_id], "Inserting new weight", function (weight, err) {
		        if (err) {
		            return callback();
		        }
		        return callback(weight[0]);
		    });
		} else {
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('definitr un error lindo para esto');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			return callback();
		}
    });
}

function _update(callback) {
	var object_id = req.params.domainId;
	var exercise_name = req.body.exercise_name;
	var amount = req.body.amount;
	var date = req.body.date;
	var unbroken = (req.body.unbroken == 'on');

    global.connection.query('SELECT id FROM exercise WHERE lower(name) = lower($1)', [exercise_name], "getting exercise id", function (data, err) {
        if (err) {
            return callback();
        }
        if (data[0]) {
			var update_query = 'UPDATE weight set exercise_id=$2, amount=$3, date=$4, unbroken=$5 WHERE id = $1 returning id';
		    global.connection.query(update_query, [object_id, data[0].id, amount, date, unbroken], "Updating weight", function (weight, err) {
		        if (err) {
		            return callback();
		        }
		        return callback(weight[0]);
		    });
		} else {
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('definitr un error lindo para esto');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			console.info('el ejercicio no existe');
			return callback();
		}
    });
}

function _delete(callback) {
	var weight_id = req.params.domainId;
    global.connection.query('DELETE FROM weight WHERE id = $1 returning id', [weight_id], "Deleting weight", function (weight, err2) {
        if (err2) {
            return callback();
        }
        return callback(weight[0].id);
    });
}

function _get_all(callback) {
	var search_term = '%'; 
	if (req.query.search_term) {
		console.info('Search Term: ' + req.query.search_term.toLowerCase());
		search_term = req.query.search_term + '%';
	}
	var user_id = req.merge.user.user_id;
    global.connection.query('select_weight_by_user', [user_id, search_term], "Getting all the weight related to the logged user", function (weight, err1) {
        if (err1) {
            return callback('internal_error');
        } else {
	    	global.connection.query('SELECT * from exercise', null, "Getting all exercises", function (exercises, err2) {
		        if (err2) {
		            return callback();
		        }
		        var merge = _.merge({'weight_list': weight}, {'exercise_list': exercises});
		        return callback(merge);
			});
        }
    });
}

function _extra_validators(req, res) {
	// hacer un validador para el campo date.
    // hacer un validador que te obligue al menos a poner uno de los 2 o los 2. (peso o reps)
}

module.exports = function(request) {
    req = request;
    return {
        get					: _get,
        save				: _save,
        update				: _update,
        delete				: _delete,
        get_all				: _get_all,
        extra_validators	: _extra_validators
    };
};