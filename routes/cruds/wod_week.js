"use strict";

var _ = require('lodash');
var async = require('async');
var req;

function _get(object_id, callback2) {
	var data_merge = {};
	var tasks = [];

	tasks.push(function(callback) {
		global.connection.query('select_wod_week_by_id', [object_id], 'Getting wod week to edit: ' + object_id, function (wod_modify, err1) {
			if (err1) {
				return callback(err1);
			}
			data_merge = _.merge(data_merge, {'wod_modify':wod_modify}, {'object_id':object_id});
			return callback(null);
		});
	});	

	tasks.push(function(callback) {
		var box_id = req.query.box;
		console.log("Load All categories by box: " + box_id);
		 global.connection.query('select_categories_by_box', [box_id], "Getting all categories", function (categories, err) {
			if (err) {
				return callback(err);
			}
			data_merge = _.merge(data_merge, {'my_categories':categories});
			return callback(null);
		});
	});

	tasks.push(function(callback) {
		var box_id = req.query.box;
		 global.connection.query('select_wod_week_all', [box_id], "Getting all wods  week", function (wods_week, err) {
			if (err) {
				return callback(err);
			}
			data_merge = _.merge(data_merge, {'wods_week':wods_week}, {'box_id':box_id});
			return callback(null);
		});
		
	});

	async.waterfall(tasks, function(err) {
		console.log("Runn all queries");
		console.log('======' + JSON.stringify(data_merge));
		return callback2(data_merge);
	});
}

function _get_all(callback) {
	return callback();
}

function _save(callback) {
	var wod_name 			= req.body.wod_name;
	var wod_text 			= req.body.wod_text;
	var wod_date 			= req.body.wod_date;
	var wod_public 			= req.body.wod_public;
	var category_id 		= req.body.category_id;
	var box_id 				= req.body.box_id;

	global.connection.query('insert_wod_week_bycoach', [wod_name, wod_date, wod_text, category_id, wod_public, box_id], "Insert a wod", function (wod, err) {
		if (err) {
			return callback(err);
		}
		return callback(wod[0]);
	});
}

function _update(callback) {
	var wod_name 			= req.body.wod_name;
	var wod_text 			= req.body.wod_text;
	var wod_date 			= req.body.wod_date;
	var wod_public 			= req.body.wod_public;
	var category_id 		= req.body.category_id;
	var box_id 				= req.body.box_id;
	var wod_week_id 		= req.params.domainId;

	global.connection.query('update_wod_week_bycoach', [wod_name, wod_date, wod_text, category_id, wod_public, box_id, wod_week_id], "update a wod", function (wod, err) {
		if (err) {
			return callback(err);
		}
		return callback(wod[0]);
	});
}

function _delete(callback) {
	var wod_week_id 		= req.params.domainId;
	global.connection.query('DELETE FROM wod_week WHERE id=$1 returning id', [wod_week_id], "delete a wod", function (wod, err) {
		if (err) {
			return callback(err);
		}
		return callback(wod[0]);
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