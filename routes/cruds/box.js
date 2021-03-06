"use strict";

var _ = require('lodash');
var req;

function _get(object_id, callback) {
	global.connection.query('SELECT * FROM box WHERE id = $1', [object_id], 'Getting box to edit: ' + object_id, function (box, err1) {
		if (err1) {
			return callback();
		} else {
			global.connection.query('select_user_box_list', [box[0].id, 750], "Getting all the admin users of the box", function (user_box, err2) {
				if (err2) {
					return callback();
				}
				var merge = _.merge({'box_info': box[0]}, {'user_box_list': user_box});
				return callback(merge);
			});
		}
	});
}

function _save(callback) {
	var name = req.body.name;
	var address = req.body.address;
	var phone = req.body.phone;
	var payment_method = req.body.payment_method;
	var is_active = req.body.is_active;

	var insert_query = 'INSERT INTO box (id, name, address, phone, payment_method, is_active) VALUES (nextval(\'box_sequence\'), $1, $2, $3, $4, $5) RETURNING id';
	global.connection.query(insert_query, [name, address, phone, payment_method, is_active], "Inserting new box", function (box, err) {
		if (err) {
			return callback();
		}
		return callback(box[0]);
	});
}

function _update(callback) {
	var object_id = req.params.domainId;
	var name = req.body.name;
	var address = req.body.address;
	var phone = req.body.phone;
	var payment_method = req.body.payment_method;
	var is_active = req.body.is_active;

	var update_query = 'UPDATE box set name=$2, address=$3, phone=$4, payment_method=$5, is_active=$6 WHERE id = $1 returning id';
	global.connection.query(update_query, [object_id, name, address, phone, payment_method, is_active], "Updating box", function (box, err) {
		if (err) {
			return callback();
		}
		return callback(box[0]);
	});
}

function _delete(callback) {
	var box_id = req.params.domainId;
	global.connection.query('DELETE FROM user_box WHERE box_id = $1', [box_id], "Removing all the user relation of the box", function (box, err1) {
		if (err1) {
			return callback();
		}
		global.connection.query('UPDATE box SET is_active=false WHERE id = $1 returning id', [box_id], "Deleting box, in a logic way", function (box, err2) {
			if (err2) {
				return callback();
			}
			return callback(box[0].id);
		});
	});
}

function _get_all(callback) {
	var search_term = req.query.search_term;
	var query = 'SELECT * FROM box';
	var params = [];
	if (search_term) {
		console.info('Search Term: ' + search_term);
		query = query + " WHERE lower(name) like $1";
		params.push(search_term.toLowerCase() + '%');
	}
	query = query + " ORDER BY name";
	global.connection.query(query, params, "Getting all the boxes", function (box, err) {
		if (err) {
			return callback();
		}
		return callback(box);
	});
}

function _extra_validators(req, res) {
	req.assert('phone', res.__('only_phone_req')).phone();
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