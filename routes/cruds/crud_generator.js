"use strict";

var _ = require('lodash');
var required;

function _get (req, res, domain) {
    var object = require('./' + domain + '.js')();
    if (object) {
        console.info(domain + 'Domain initialized.');
    } else {
        console.error(domain + '.js is missing.');
    }
    object.get_all(function (shifts){
        _.merge(req.merge, {'shifts' : shifts});
        if (req.params.domainId) {
            object.get(req.params.domainId, function (shift) {
                _.merge(req.merge , {'shift': shift});
                return res.sendPage(domain);
            })
        } else {
            console.info('Getting shifts');
                return res.sendPage(domain);
        }
    });

}

function _post (req, res, domain) {
    var object = require('./' + domain + '.js')();
    console.info(required);
    required.forEach(function (rName) {
        console.info('Adding requried for field ' + rName);
        req.assert(rName, rName + ' is required').notEmpty();
    })


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
        }
        if (req.params.domainId) {
            console.info('Is post Edit');
            object.update(req, callback)
        } else {
            console.info('Is post NEW');
            object.save(req, callback);
        }
        res.status(200).send();
    }
}


function _register (app, domainNames, requiredNames) {
    console.info("Initializing CRUDS");
    required = requiredNames;
    domainNames.forEach(function (domain) {
        app.get('/' + domain + '/:domainId?', function (req, res) { return _get(req, res, domain)});
        app.post('/' + domain + '/:domainId?', function (req, res) { return _post(req, res, domain)});
        console.info(domain + ' Registered');
    });
}

module.exports = module.exports = function() {
    return {
        register : _register
    };
};