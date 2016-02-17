'use strict'

var _ = require('lodash');
var user = require('../../domain/User.js')();
var userSession = require('../../domain/UserSession.js')();

function _get(req, res) {
    console.info('Loading escaped login page');
    console.info(req.auth_user);
    if (req.auth_user) {
       return  res.redirect(302, '/home');
    } else {
        return res.sendPage('login');
    }
}

function _post(req, res) {
    console.info('Posting login page');
    console.info(req.body.email);
    console.info(req.body.pwd);
    user.getUserByEmail(req.body.email, function (user) {
        console.info("User: " + user.user_name);
        var sessionHash = global.guid();
        res.cookie('ShiftfitLogin', sessionHash);
        userSession.setNewSession(sessionHash, user.id, function (err) {
            if (err) {
                return res.status(500).send();
            }
            return  res.redirect(302, '/home');
        })
    });
}

module.exports = function () {
    return {
        register : function (app) {
            app.post('/login', _post);
            app.get('/login', _get);
        }
    }
};