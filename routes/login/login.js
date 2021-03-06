'use strict';

var _ = require('lodash');
var userClass = require('../../domain/User.js')();
var userSession = require('../../domain/UserSession.js')();

//var hash = bcrypt.hashSync("bacon");
//bcrypt.compareSync("bacon", hash); // true
//bcrypt.compareSync("veggies", hash); // false

function _get(req, res) {
	console.info('Loading escaped login page');
	console.info('req.auth_user: ' + req.auth_user);
	if (req.auth_user) {
		return res.redirect(302, '/home');
	} else {
		return res.sendPage('login');
	}
}

function _post(req, res) {
	console.info('Posting login page!');
	console.info(req.body.email);
	console.info(req.body.pwd);

	userClass.getUserByEmail(req.body.email, function (user) {
		console.info("User = " + JSON.stringify(user));

		if(user == null || user == undefined) {
			console.info("Registering user with email: " + req.body.email);

			req.assert('email', 'Email Address is required').notEmpty();
			req.assert('first_name', 'First Name is required').notEmpty();
			req.assert('last_name', 'Last Name is required').notEmpty();
			req.assert('pwd', 'Password required').notEmpty();
			req.assert('pwd', 'Password must have 6 characters at least.').len(6,50);
			req.assert('cpwd', 'Confirm Password required').notEmpty();
			req.assert('cpwd', 'Confirm Password must have 6 characters at least.').len(6,50);

			var errors = req.validationErrors();
			if(errors) {
				var errors = [{'type':'general', 'param': 'none', 'msg':errors[0].msg}];
				res.status(500).send(errors);
			} else {
				var email 				= req.body.email;
				var first_name 			= req.body.first_name;
				var last_name 			= req.body.last_name;
				var password 			= global.hashSync(req.body.pwd);

				if (req.body.pwd == req.body.cpwd) {
					userClass.registerNewUser(email, password, first_name, last_name, function (userNew) {
						console.info("Register user");
						console.info("User = " + JSON.stringify(userNew));
						user = userNew;
						create_session_and_redirect(req, res, user);
					});					
				} else {
					var errors = [{'type':'general', 'param': 'pwd', 'msg': ''}, {'type':'general', 'param': 'cpwd', 'msg': 'The passwords are different'}];
					res.status(500).send(errors);					
				}
			}

		} else {
			console.info('logging user');
			req.assert('pwd', 'Password required').notEmpty();

			var errors = req.validationErrors();
			if(errors) {
				var errors = [{'type':'general', 'param': 'pwd', 'msg':errors[0].msg}];
				console.info('ERROR ' + JSON.stringify(errors));
				res.status(500).send(errors);
			} else {
				login(req, res, user, function() {
					create_session_and_redirect(req, res, user);	
				});
			}
		}
	});

	console.info("Not Logged user");
}

function login(req, res, user, callback) {
	if (global.compareSync(req.body.pwd, user.password)) {
		callback();
	} else {
		var errors = [{'type':'general', 'param': 'pwd', 'msg': 'Wrong username or password'}];
		res.status(500).send(errors);		
	}
}

function create_session_and_redirect(req, res, user) {
	var sessionHash = global.guid();
	res.cookie('ShiftfitLogin', sessionHash);
	userSession.setNewSession(sessionHash, user.id, function (err) {
		if (err) {
			console.info('Error creating session: ' + err);
			return res.status(500).send();
		} else {
			var rol_query = 'SELECT home FROM rol WHERE id = $1';
		    global.connection.query(rol_query, [user.rol_id], 'Getting redirect url after correct login/signup', function(result, err) {
		        if (err || !result) {
		            console.error('Error getting redirect url');
					return res.status(200).send('/home');
		        } else {
			        console.info('Redirecting to: ' + result[0].home);
					res.status(200).send(result[0].home);	        	
		        }
		    });
		}
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

function login_with_face(req, res) {
	console.info(req.body);
	if (req.body.email) {
		userClass.getUserByEmail(req.body.email, function (user) {
			if (user) {
				if (user.face_id == req.body.id) {
					return create_session_and_redirect(req, res, user);
				}
			} else {
				userClass.registerNewUser(req.body.email, global.guid(), req.body.first_name, req.body.last_name,req.body.id, function (userNew) {
					console.info("Register user");
					console.info("User = " + JSON.stringify(userNew));
					return create_session_and_redirect(req, res, userNew);
				});
			}
		});
	} else {
		return res.status(500).send();
	}

}

module.exports = function () {
	return {
		register : function (app) {
			app.get('/login', _get);
			app.get('/logout', _logout);
			app.get('/email_exists/:email', _check_email);
			app.post('/login', _post);
			app.post('/login_with_face', login_with_face);
		}
	};
};