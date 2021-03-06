"use strict";

var _ = require('lodash');
var required;
var permissions = require('./crud_permissions.js')();

function _get (req, res, domain) {
	var object = require('./' + domain + '.js')(req);
	if (object) {
		console.info(domain + ' Domain initialized.');
	} else {
		console.error(domain + '.js is missing.');
	}
	object.get_all(function (oDoms){
		var dom = domain + 's';
		var objs = {};
		objs[dom] = oDoms;
		_.merge(req.merge, objs);
		if (req.params.domainId) {
			object.get(req.params.domainId, function (oDom) {
				var obj = {};
				obj[domain] = oDom;
				_.merge(req.merge , obj);
				return res.sendPartialPage(domain);
			});
		} else {
			console.info('Getting ' + domain);
			return res.sendPartialPage(domain);
		}
	});
}

function _post (req, res, domain) {
	var object = require('./' + domain + '.js')(req);

	console.info(required);
	console.info(required[domain]);

	required[domain+""].forEach(function (rName) {
		console.info('Adding requried for field ' + rName);
		req.sanitize(rName).trim();
		req.assert(rName, res.__(rName) + ' ' + res.__('is_required')).notEmpty();
	});

	if (object.extra_validators) {
		object.extra_validators(req, res);
	}

	var errors = req.validationErrors();

	if(errors) {
		console.info('Validation failed');
		var errors = [{'type': 'general', 'param': 'none', 'msg': errors[0].msg}];
		res.status(500).send(errors);
	} else {
		var callback = function (id) {
			if (id) {
				res.status(200).send();
			} else {
				var errors = [{'type': 'general', 'param': 'none', 'msg': res.__('general_error')}];
				res.status(500).send(errors);
			}
		};

		 if (req.params.domainId && req.params.domainId != '0') {
			console.info('Is post Edit');
			object.update(callback);
		} else {
			console.info('Is post NEW');
			object.save(callback);
		}
	}
}

function _delete (req, res, domain) {
	var object = require('./' + domain + '.js')(req);
	if (object) {
		console.info(domain + ' Domain initialized.');
		object.delete(function (id) {
			if (id) {
				res.status(200).send();
			} else {
				res.status(500).send();
			}
		});
	} else {
		console.error(domain + '.js is missing.');
	}
}

function _register (app, domainNames, requiredNames) {
	console.info("Initializing CRUDS");
	required = requiredNames;
	domainNames.forEach(function (domain) {
		if (permissions[domain]) {
			app.weighted_get('/' + domain + '/:domainId?', permissions[domain], function (req, res) {
				return _get(req, res, domain);
			});
			app.weighted_post('/' + domain + '/:domainId?', permissions[domain], function (req, res) {
				return _post(req, res, domain);
			});
			app.weighted_delete('/' + domain + '/:domainId?', permissions[domain], function (req, res) {
				return _delete(req, res, domain);
			});
			console.info(domain + ' Registered');
		} else {
			throw new Error('Permission not setted up in crud_permissions.js for: ' + domain);
		}

	});
}

module.exports = function() {
	return {
		register		: _register,
	};
};