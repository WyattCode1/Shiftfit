"use strict";

var _ = require('lodash');
var req;

function _get(object_id, callback) {
	global.connection.query('SELECT * FROM category WHERE id = $1', [object_id], 'Getting category to edit: ' + object_id, function (category, err) {
		if (err) {
			return callback();
		}
		return callback(category[0]);
	});
}

function _save(callback) {
	var name = req.body.name;
	var color = req.body.background_color;
	var box_id = req.body.category_box_id;

	var insert_query = 'INSERT INTO category (id, name, color, box_id) VALUES (nextval(\'category_sequence\'), $1, $2, $3) RETURNING id';
	global.connection.query(insert_query, [name, color, box_id], "Inserting new category", function (category, err) {
		if (err) {
			return callback();
		}
		return callback(category[0]);
	});
}

function _update(callback) {
	var object_id = req.params.domainId;
	var name = req.body.name;
	var color = req.body.background_color;
	var box_id = req.body.category_box_id;

	var update_query = 'UPDATE category set name=$2, color=$3, box_id=$4 WHERE id = $1 returning id';
	global.connection.query(update_query, [object_id, name, color, box_id], "Updating category", function (category, err) {
		if (err) {
			return callback();
		}
		return callback(category[0]);
	});
}

function _delete(callback) {
	global.connection.query('DELETE FROM category WHERE id = $1 returning id', [req.params.domainId], "Deleting category", function (category, err) {
		if (err) {
			return callback();
		}
		return callback(category[0].id);
	});
}

function _get_all(callback) {
	var search_id = req.query.search_id;
	var query = 'SELECT * FROM category';
	var params = [];
	if (search_id) {
		console.info('Search Id: ' + search_id);
		query = query + " WHERE box_id=$1";
		params.push(search_id);
	}
	query = query + " ORDER BY name";
	global.connection.query(query, params, "Getting all the categories", function (category, err) {
		if (err) {
			return callback();
		}
		return callback(category);
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