'use strict';

var _ = require('lodash');
var userClass = require('../../domain/User.js')();
var userSession = require('../../domain/UserSession.js')();

function _get(req, res) {
	console.info('Loading escaped login page');
	console.info(req.auth_user);

if (req.auth_user) {
		return res.redirect(302, '/home');
	} else {
		return res.sendPage('login');
	}
}

function _post(req, res) {
	console.info('Posting login page');
	console.info(req.body.email);
	console.info(req.body.pwd);

	userClass.getUserByEmail(req.body.email, function (user) {
		console.info("User = " + JSON.stringify(user));

		if(user == null || user == undefined) {
			console.info("Registrando mail: " + req.body.email);
/*
			try {
				req.assert('first_name').empty();
			} catch (e) {
				log.info('Error saving profile experience. ', e);
				return res.status(500).send(e);
			}

			req.assert('first_name', 'First Name is required').notEmpty();
			req.assert('last_name', 'Last Name is required').notEmpty();
			req.assert('password', 'Password required').notEmpty();
			req.assert('password', 'Password must have 6 characters at least.').len(6,50);
*/
			userClass.registerNewUser(req.body.email, req.body.pwd, req.body.first_name, req.body.last_name, function (userNew) {
				console.info("Register user");
				console.info("User = " + JSON.stringify(userNew));
				user = userNew;
				create_session_and_redirect(req, res, user);
			});

		} else {
			create_session_and_redirect(req, res, user);
		}
	});

	console.info("Not Logged user");
}

function create_session_and_redirect(req, res, user) {
	var sessionHash = global.guid();
	res.cookie('ShiftfitLogin', sessionHash);
	userSession.setNewSession(sessionHash, user.id, function (err) {
		if (err) {
			return res.status(500).send();
		}
		return res.redirect(302, '/home');
	});
}

function _check_email(req, res) {
	var email = req.params.email;
	console.info("checking email if exists: " + email);
	if (email) {
		var query = "select exists (select 1 from shiftfit_user where lower(email) = lower($1)) as existing";
		global.connection.query(query, [email], "Email exist query", function(data) {
			console.info('Response: ' + data[0].existing);
			res.status(200).send(data[0].existing);
		});
	} else {
		res.status(200).send(false);
	}
}

function _logout(req, res) {
	res.clearCookie('ShiftfitLogin');
	res.redirect(302, '/home');
}

module.exports = function () {
	return {
		register : function (app) {
			app.get('/login', _get);
			app.get('/logout', _logout);
			app.get('/email_exists/:email', _check_email);
			app.post('/login', _post);
		}
	};
};