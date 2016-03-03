'use strict';

var _ = require('lodash');

function _getUserByEmail(email, callback) {
	var user_query = 'SELECT * FROM shiftfit_user su LEFT JOIN rol r ON (r.id = su.rol_id) where lower(su.email) = lower($1)';
	global.connection.query(user_query, [email], 'Getting user by email', function(user, err) {
		if (err) {
			console.error(err.message);
			return callback();
		}
		return callback(user[0]);
	});
}

function _registerNewUser(email, psw, first_name, last_name, callback) {
	global.connection.query('insert_new_member', [email, psw, first_name, last_name], 'Create new user', function(user, err) {
		console.info("Create user");
		if (err) {
			console.error(err.message);
			return callback();
		}
		console.info("Success !!!");
		return callback(user[0]);
	});
}

module.exports = function () {
	return {
		getUserByEmail: _getUserByEmail,
		registerNewUser: _registerNewUser
	};
};