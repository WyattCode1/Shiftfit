'use strict';

var _ = require('lodash');
var userClass = require('../../domain/User.js')();
var userSession = require('../../domain/UserSession.js')();


function _post(req, res) {
    req.assert('userEmail', 'User email' +  res.__('is_required')).notEmpty();

    var errors = req.validationErrors();
    console.log('EMAIL: ' + req.body.userEmail);
    if(errors) {
        console.info('Validation failed');
        var errors = [{'type': 'general', 'param': 'none', 'msg': errors[0].msg}];
        res.status(500).send(errors);
    } else {
        userClass.getUserByEmail(req.body.userEmail, function (user, err) {
            var sessionHash = global.guid();
            res.cookie('AdminShiftLogin', req.cookies.ShiftfitLogin);
            res.cookie('ShiftfitLogin', sessionHash);
            userSession.setNewSession(sessionHash, user.id, function (err) {
                res.status(200).send(user.home);
            });
        });
    }
}


module.exports = function () {
    return {
        register : function (app) {
            app.admin_post('/impersonate', _post);
        }
    };
};