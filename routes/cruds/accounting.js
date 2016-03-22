"use strict";

var _ = require('lodash');

function _get(object_id, callback) {
    global.connection.query('SELECT * FROM accounting WHERE id = $1', [object_id], 'Getting accounting to edit: ' + object_id, function (accounting, err) {
        if (err) {
            return callback();
        }
        return callback(accounting[0]);
    });
}

function _save(req, callback) {
	var amount = req.body.amount;
	var box_id = req.body.box_id;
	var description = req.body.description;

	var insert_query = 'INSERT INTO accounting (id, description, amount, box_id) VALUES (nextval(\'accounting_sequence\'), $1, $2, $3) RETURNING id';
    global.connection.query(insert_query, [description, amount, box_id], "Inserting new accounting", function (accounting, err) {
        if (err) {
            return callback();
        }
        return callback(accounting[0]);
    });
}

function _update(req, callback) {
	var object_id = req.params.domainId;
	var description = req.body.description;
	var amount = req.body.amount;
	var box_id = req.body.box_id;

	var update_query = 'UPDATE accounting set description=$2, amount=$3, box_id=$4 WHERE id = $1 returning id';
    global.connection.query(update_query, [object_id, description, amount, box_id], "Updating accounting", function (accounting, err) {
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
    global.connection.query('select * from accounting ORDER BY id DESC', null, "Getting all accountings", function (accounting, err1) {
        if (err1) {
            return callback();
        } else {
	    	global.connection.query('SELECT * from box', null, "Getting all boxes", function (box, err2) {
		        if (err2) {
		            return callback();
		        }
		        var merge = _.merge({'accounting_list': accounting}, {'box_list': box});
		        return callback(merge);
			});
        }
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