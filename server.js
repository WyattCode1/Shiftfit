'use strict';
var config = require('./utils/config.js')(process.env);

/*---HTTPS---*/
var https = require('https');
var fs = require('fs');

var options = {
	key: fs.readFileSync('certificate/shiftfit.key'),
	cert: fs.readFileSync('certificate/shiftfit.cert')
};


/*---Express config---*/
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
var BODY_LIMIT_KB = 1024 * 1024 * 8;
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: BODY_LIMIT_KB}));
app.use(bodyParser.urlencoded({
	limit: BODY_LIMIT_KB,
	extended: true
}));
/*---End express config---*/

process.on('uncaughtException', function (err) {
	console.error('Caught exception: ' + err.stack);
});

/*------Set up I18n------*/
var i18n = require('i18n');
i18n.configure({
	locales:['es', 'en'],
	defaultLocale: 'es',
	cookie: 'lang',
	directory: __dirname + '/locales'
});
app.use(i18n.init);
/*------End set up I18n------*/

/*---tracer----*/
var log = require('tracer').console({level:'info', format : "{{timestamp}} <{{title}}> [{{file}}:{{line}}} {{message}} ", dateformat : "HH:MM:ss.L"});
app.use(i18n.init);
console.info = log.info;
console.error = log.error;
console.debug = log.debug;
/*---end tracer----*/

/*GUID GENERATOR*/
global.guid = function guid() {
	function _p8(s) {
		var p = (Math.random().toString(16)+"000000000").substr(2,8);
		return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
	}
	return _p8() + _p8(true) + _p8(true) + _p8() + _p8(true) + _p8(true) + _p8();
};
/*END GUID GENERATOR*/

/*STATIC*/
app.use('/assets', express.static(
	path.join(__dirname, 'assets'), {
		index: false,
		setHeaders: function(res, path) {
			var rel = path.match(/[^\/]+\/[^\/]+$/);
			res.set('Cache-Control', 'no-cached');
		}
	}
));
app.use('/images', express.static(
	path.join(__dirname, 'images'), {
		index: false,
		setHeaders: function(res, path) {
			var rel = path.match(/[^\/]+\/[^\/]+$/);
			res.set('Cache-Control', 'no-cached');
		}
	}
));
/*STATIC*/

/*ROOT REDIRECT*/
app.get('', function (req, res) {
	return res.redirect(301, '/home');
});
/*ROOT REDIRECT*/


var express_validator = require('./utils/validator.js')(app);

/*bcrypt initialization*/
var bcrypt = require('bcrypt');
var salt = "$2a$10$lQezIBTrejG2XW/lZS3jUO";

/*---Global exports---*/
global.config = config;
global.connection = require('./utils/pg_connector.js')(config);
global.hashSync = function hashSync(data) {
	return bcrypt.hashSync(data, salt);
}
global.compareSync = function (data, hash) {
	return bcrypt.compareSync(data, hash);
}

/*---Server startup---*/
var server = app.listen(config.app_port, function () {
	console.log('Example app listening at ' + config.app_port);
});
https.createServer(options, app).listen(443);

/* Calling routes */
var routes = require('./routes/routes.js')(app, config);


module.exports = function () {
	return {
		close: function() {
			server.close(function(callback) {
				console.log('closed');
			});
		},
		listen: function(ready) {
			server.listen(3000, function() {
				return ready(config, server);
			});
		},
		get_test_app: function () {
			//Set up test environment variables
			config.postgresql = config.postgresql_test;
			return app;
		}
	};
};
