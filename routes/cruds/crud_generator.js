"use strict";

var _ = require('lodash');
function _get (req, res, domain) {
    var object = require('./' + domain + '.js')();
    if (object) {
        console.info(domain + 'Domain initialized.');
    } else {
        console.error(domain + '.js is missing.');
    }
    if (req.params.domainId) {
        object.get(req.params.domainId, function (shift) {
            _.merge(req.merge , {'shift': shift});
            console.info('Is get Edit ' + JSON.stringify(req.merge));
            return res.sendPage(domain);
        })
    } else {
        console.info('Is get New one');
        return res.sendPage(domain);
    }

}

function _post (req, res, domain) {
    if (req.params.domainId) {
        console.info('Is post Edit');
    } else {
        console.info('Is post NEW');
    }
    res.status(200).send();
}


function _register (app, domainNames) {
    console.info("Initializing CRUDS");
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