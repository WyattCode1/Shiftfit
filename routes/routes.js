'use strict';

var app;
var config;
var _ = require('lodash');
var dot = require("dot").process({
	path: (__dirname + "/../views")
});

function loadApp() {

	app.use(function user(req, res, next) {
		req.merge = {};
		if (req.cookies.ShiftfitLogin) {
			var token = req.cookies.ShiftfitLogin;
			global.connection.query('select_user_by_session', [token], 'Getting logged user', function(user) {
				if (user[0]) {
					console.info('Logged = ' + user[0].user_name);
					req.auth_user = user[0];
					req.merge = _.merge(req.merge, {"user": req.auth_user});
				} else {
					console.info("user doesn't logged");
				}
				next();
			});
		} else {
			next();
		}
	});

	app.use(function header(req, res, next) {
		next();
	});

	app.use(function footer(req, res, next) {
		next();
	});

	app.use(function easyRender(req, res, next) {
		res.sendPage = function (template) {
			var body = dot[template](_.merge(req.merge, config));
			res.status(200).send(dot.main(_.merge({"body": body}, config)));
		};
		next();
	});

	app.admin_get = function (path, callback) {
		app.get(path, function (req, res) {
			return is_admin(req, res, callback);
		});
	};

	app.admin_post = function (path, callback) {
		app.post(path, function (req, res) {
			return is_admin(req, res, callback);
		});
	};

	function is_admin(req, res, callback) {
		if (req.auth_user && req.auth_user.is_admin) {
			return callback(req, res);
		} else {
			console.info('Have not permission to access to this page');
			return res.status(403).send('forbidden');
		}
	};

	require('./dashboard/dashboard.js')().register(app, config);

	require('./home/home.js')().register(app, config);

	require('./login/login.js')().register(app, config);
}

module.exports = function (application, conf) {
	app = application;
	config = conf;
	loadApp();
};