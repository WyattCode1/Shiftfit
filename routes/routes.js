'use strict';

var app;
var config;
var _ = require('lodash');
var dot = require("dot").process({
	path: (__dirname + "/../views")
});

function loadApp() {

	app.use(function user(req, res, next) {
		if(!req.cookies.lang) {
			res.cookie('lang', 'es');
			return res.redirect(req.url);
		}
		req.merge = {};
		if (req.cookies.ShiftfitLogin) {
			var token = req.cookies.ShiftfitLogin;
			global.connection.query('select_user_by_session', [token], 'Getting logged user', function(user) {
				if (user[0]) {
					console.info('Logged = ' + user[0].user_name);
					req.auth_user = user[0];
					req.merge = _.merge(req.merge, {'user': req.auth_user}, {'is_admin': req.auth_user.weight >= 10});
				} else {
					console.info("user doesn't logged: " + req.url);
				}
				next();
			});
		} else {
			next();
		}
	});

	app.use(function header(req, res, next) {
		req.merge = _.merge(req.merge, {"is_login_page": req.url=='/login'});
		req.merge = _.merge(req.merge, {"is_home_page":  req.url=='/home'});
		next();
	});

	app.use(function footer(req, res, next) {
		next();
	});

	app.use(function easyRender(req, res, next) {
		res.sendPage = function (template) {
			try {
				var body = dot[template](_.merge(req.merge, config, {i18n:res.__}));
			} catch (e) {
				console.error('Could not find page', e);
				throw e;
			}
			res.status(200).send(dot.main(_.merge({"body": body}, config)));
		};
		next();
	});

	app.use(function partialRender(req, res, next) {
		res.sendPartialPage = function (template) {
			try {
				var body = dot[template](_.merge(req.merge, config, {i18n:res.__}));
			} catch (e) {
				console.error('Could not find page', e);
				throw e;
			}
			res.status(200).send(body);
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

	require('./admin/admin.js')().register(app, config);

	require('./dashboard/dashboard.js')().register(app, config);

	require('./home/home.js')().register(app, config);

	require('./login/login.js')().register(app, config);

	require('./cruds/crud_generator.js')().register(app, ['shift'], {'shift': ['name']});

}

module.exports = function (application, conf) {
	app = application;
	config = conf;
	loadApp();
};