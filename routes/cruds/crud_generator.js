"use strict";

var _ = require('lodash');
var required;

function _get (req, res, domain) {
    var object = require('./' + domain + '.js')();
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
    var object = require('./' + domain + '.js')();

    console.info(required);
    console.info(required[domain]);

    required[domain+""].forEach(function (rName) {
        console.info('Adding requried for field ' + rName);
        req.assert(rName, res.__(rName) + ' ' + res.__('is_required')).notEmpty();
    });

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
                res.status(500).send();
            }
        };
        if (req.params.domainId) {
            console.info('Is post Edit');
            object.update(req, callback);
        } else {
            console.info('Is post NEW');
            object.save(req, callback);
        }
        res.status(200).send();
    }
}

function _delete (req, res, domain) {
    var object = require('./' + domain + '.js')();
    if (object) {
        console.info(domain + ' Domain initialized.');
        object.delete(req, function (id) {
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
        app.get('/' + domain + '/:domainId?', function (req, res) {
        	return _get(req, res, domain);
        });
        app.post('/' + domain + '/:domainId?', function (req, res) {
        	return _post(req, res, domain);
        });
        app.delete('/' + domain + '/:domainId?', function (req, res) {
        	return _delete(req, res, domain);
        });
        console.info(domain + ' Registered');
    });
}

module.exports = module.exports = function() {
    return {
        register : _register
    };
};