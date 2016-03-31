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
					req.auth_user = user[0];
					global.connection.query('select_boxes_by_user', [user[0].user_id], 'Getting the list of boxes owned by this user', function(my_boxes) {
						if (my_boxes) {
							req.merge = _.merge(req.merge, {'my_boxes': my_boxes});

							var is_admin_box = false;
							req.merge.my_boxes.forEach(function(each){
								if (each.is_admin) {
									is_admin_box = true;
								}
							});
							req.merge = _.merge(req.merge, {"is_admin_box": is_admin_box});
						}

						req.merge = _.merge(req.merge, {'user': req.auth_user}, {'is_admin': req.auth_user.weight >= 10});
						next();
					});
				} else {
					console.info("user doesn't logged: " + req.url);
					next();
				}
			});
		} else {
			next();
		}
	});

	app.use(function header(req, res, next) {
		req.merge = _.merge(req.merge, {"is_login_page": req.url=='/login'});
		req.merge = _.merge(req.merge, {"is_home_page": req.url=='/home'});
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

	app.login_get = function (path, callback) {
		app.get(path, function (req, res) {
			return is_logged(req, res, callback);
		});
	};

	app.login_post = function (path, callback) {
		app.post(path, function (req, res) {
			return is_logged(req, res, callback);
		});
	};

	function is_logged(req, res, callback) {
		if (req.auth_user) {
			return callback(req, res);
		} else {
			console.info('Have not permission to access to this page');
			return res.redirect('/myaccount');
		}
	};

	function is_admin(req, res, callback) {
		if (req.merge && req.merge.is_admin) {
			return callback(req, res);
		} else {
			console.info('Have not permission to access to this page');
			return res.status(403).send('forbidden');
		}
	};

	require('./admin/admin.js')().register(app, config);

	require('./box_admin/box_admin.js')().register(app, config);

	require('./box_admin/box_admin_info.js')().register(app, config);

	require('./dashboard/dashboard.js')().register(app, config);

	require('./home/home.js')().register(app, config);

	require('./login/login.js')().register(app, config);

	require('./cruds/crud_generator.js')().register(app, ['shift', 'box', 'accounting', 'exercise', 'weight'],
		{'shift': ['name'], 'box': ['name', 'address', 'phone'], 'accounting': ['description', 'amount', 'box_id'], 'exercise': ['name'], 'weight': ['date'] });

    require('./box_users/box_users.js')().register(app);

    require('./autocompletes/exercises_autocomplete.js')().register(app);
    require('./autocompletes/users_autocomplete.js')().register(app);

	require('./myaccount/myaccount.js')().register(app);

	require('./pictures/pictures_load.js')().register(app);
}

module.exports = function (application, conf) {
	app = application;
	config = conf;
	loadApp();
};