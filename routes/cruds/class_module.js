"use strict";

var async = require('async');
var _ = require('lodash');
var req;

function _get(object_id, callback) {
	global.connection.query('SELECT * FROM class_module WHERE id = $1', [object_id], 'Getting class_module to edit: ' + object_id, function (class_module, err) {
		if (err) {
			return callback();
		}
		return callback(class_module[0]);
	});
}

function _save(callback) {
	var description = req.body.description;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;
	var duration = req.body.duration;
	var vacancies = req.body.vacancies;
	var coach_id = req.body.coach_id;
	var category_id = req.body.category_id;
	var monday = (req.body.monday == 'on');
	var tuesday = (req.body.tuesday == 'on');
	var wednesday = (req.body.wednesday == 'on');
	var thursday = (req.body.thursday == 'on');
	var friday = (req.body.friday == 'on');
	var saturday = (req.body.saturday == 'on');
	var sunday = (req.body.sunday == 'on');
	var box_id = req.body.class_module_box_id;

	global.connection.query('insert_class_module',
		[description, start_time, end_time, duration, vacancies, coach_id, category_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, box_id],
		"Inserting new class_module", function (class_module, err) {

		if (err) {
			return callback();
		}

		return callback(class_module[0]);
	});
}

function _update(callback) {
	var object_id = req.params.domainId;
	var description = req.body.description;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;
	var duration = req.body.duration;
	var vacancies = req.body.vacancies;
	var coach_id = req.body.coach_id;
	var category_id = req.body.category_id;
	var monday = (req.body.monday == 'on');
	var tuesday = (req.body.tuesday == 'on');
	var wednesday = (req.body.wednesday == 'on');
	var thursday = (req.body.thursday == 'on');
	var friday = (req.body.friday == 'on');
	var saturday = (req.body.saturday == 'on');
	var sunday = (req.body.sunday == 'on');

	global.connection.query('update_class_module',
		[object_id, description, start_time, end_time, duration, vacancies, coach_id, category_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday],
		"Updating class_module", function (class_module, err) {
		if (err) {
			return callback();
		}
		return callback(class_module[0]);
	});
}

function _delete(callback) {
	global.connection.query('DELETE FROM class_module WHERE id = $1 returning id', [req.params.domainId], "Deleting class_module", function (class_module, err) {
		if (err) {
			return callback();
		}
		return callback(class_module[0].id);
	});
}

function _get_all(callback) {

	var merge = {};
	var box_id = req.query.search_id;

	async.waterfall([
		function(callback) {
			var class_module_query = 'SELECT * FROM class_module WHERE box_id=$1 ORDER BY description';
			global.connection.query(class_module_query, [box_id], "Getting all the class_module", function (class_module, err) {
				if (err) {
					return callback(res.__('internal_server_error'));
				}
				merge = _.merge(merge, {'class_module_list': class_module});
				return callback();
			});
		},
		function(callback) {
			global.connection.query('select_user_box_list', [box_id, 500], "Getting all the coach users of the box", function (user_box, err) {
				if (err) {
					return callback(res.__('internal_server_error'));
				}
				merge = _.merge(merge, {'coach_list': user_box});
				return callback();
			});
		},
		function(callback) {
			var category_query = 'SELECT * FROM category WHERE box_id=$1';
			global.connection.query(category_query, [box_id], "Getting all the categories of the box", function (categories, err) {
				if (err) {
					return callback(res.__('internal_server_error'));
				}
				merge = _.merge(merge, {'category_list': categories});
				return callback();
			});
		}
	], function(err) {
			if (err) {
				return callback();
			}
			console.info('finale: ' + JSON.stringify(merge));
			return callback(merge);
		}
	);
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