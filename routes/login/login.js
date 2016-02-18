'use strict'

var _ = require('lodash');
var userClass = require('../../domain/User.js')();
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
	var sessionHash = global.guid();
	var user; 
	
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


	userClass.getUserByEmail(req.body.email, function (user) {
		console.info("Logged user");
		console.info("User = " + JSON.stringify(user));
		
		if(user == null || user==undefined) {
			userClass.registerNewUser(req.body.email, req.body.pwd, function (userNew) {
				console.info("Register user");
				console.info("User = " + JSON.stringify(userNew));
				user = userNew;
			});
		}

		res.cookie('ShiftfitLogin', sessionHash);
		userSession.setNewSession(sessionHash, user.id, function (err) {
		return res.status(200).send();

		})
	});

	console.info("Not Logged user");

}

module.exports = function () {
    return {
        register : function (app) {
            app.post('/login', _post);
            app.get('/login', _get);
        }
    }
};