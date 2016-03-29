'use strict';

var _ = require('lodash');

function _get(req, res) {
	console.info('Loading myaccount');
	res.sendPage("myaccount");
}

function _modify(req, res) {
	console.info('Saving user: ' + id);
	console.info('Saving user: ' + JSON.stringify(req.body));

	req.assert('email', res.__('email_address') + ' ' + res.__('is_required')).notEmpty();
	req.assert('name', res.__('first_name') + ' ' + res.__('is_required')).notEmpty();
	req.assert('last_name', res.__('last_name') + ' ' + res.__('is_required')).notEmpty();
	req.assert('user_name', res.__('user_name') + ' ' + res.__('is_required')).notEmpty();
	req.assert('cel_phone', res.__('cel_phone') + ' ' + res.__('is_required')).notEmpty();

	var errors = req.validationErrors();
	if(errors) {
		var errors = [{'type':'general', 'param': 'none', 'msg':errors[0].msg}];
		res.status(500).send(errors);
	} else {
		var id 					= req.body.user_id;
		var	first_name 			= req.body.name;
		var last_name 			= req.body.last_name;
		var email 				= req.body.email;
		var location 			= req.body.location;
		var city 				= req.body.city;
		var state 				= req.body.state;
		var cel_phone 			= req.body.cel_phone;
		var user_name 			= req.body.user_name;
		var birthdate 			= req.body.birthdate;
		var has_picture 		= req.body.has_picture;

		global.connection.query('update_shift_user', [id, first_name, last_name, email, location, city, state, cel_phone, user_name, birthdate], "Updating user", function (user, err) {
			if (err) {
				console.info("Exception: " + err);
				var errors = [{'type':'general', 'param': 'none', 'msg': res.__('general_error')}];
				res.status(500).send(errors);
			}
		});

		if(req.body.picture_name != null && req.body.picture_name != undefined) {
			if(has_picture != null && has_picture != "") {
				console.info('Update picture user id: ' + id);
				global.connection.query('update_picture_user', [id, req.body.picture_name, req.body.picture_type, req.body.picture_data], "Insert photo user", function (user, err) {
					if (err) {
						console.info("Exception: " + err);
						var errors = [{'type':'general', 'param': 'none', 'msg': res.__('general_error')}];
						res.status(500).send(errors);
					}
					res.status(200).send(user[0]);
				});
			} else {
				console.info('Insert picture to user id: ' + id);
				global.connection.query('insert_picture_user', [id, req.body.picture_name, req.body.picture_type, req.body.picture_data], "Updating photo user", function (user, err) {
					if (err) {
						console.info("Exception: " + err);
						var errors = [{'type':'general', 'param': 'none', 'msg': res.__('general_error')}];
						res.status(500).send(errors);
					}
					res.status(200).send(user[0]);
				});
			}
		}
	}
}

function _get_personal_information(req, res) {
	console.info('Load photo!!!!!!!!!!!!!!');
	global.connection.query('select_pricture_user_byid', [req.auth_user.id], "Select picture user", function (picture, err) {
		if (err) {
			console.info("Exception: " + err);
			var errors = [{'type':'general', 'param': 'none', 'msg': res.__('general_error')}];
			res.status(500).send(errors);
		}
		_.merge(req.merge, {'picture': picture});
		console.info('Saving user: ' + JSON.stringify(req.merge));

		res.sendPartialPage("personal_information");
	});
}

module.exports = function () {
	return {
		register : function (app) {
			app.login_get('/myaccount', _get);
			app.login_get('/personal_information', _get_personal_information);
			app.login_post('/myaccount_modify', _modify);
		}
	};
};