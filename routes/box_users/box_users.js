'use strict';

var async = require('async');
var _ = require('lodash');
var dot = require("dot").process({
	path: (__dirname + "/../../views")
});

function _get(req, res) {
    console.info('User autocomplete: ' + req.params.key);
    var key = req.params.key + '%';
    global.connection.query("SELECT email as user FROM shiftfit_user WHERE LOWER(email) LIKE LOWER($1)", [key], 'Getting shiftfit user autocomplete', function(user, err) {
        if (err) {
            return res.status(500).send();
        } else {
            return res.status(200).send(user);
        }
    });
}

function _delete_user_box(req, res) {
	var user_id = req.params.user_id;
	var box_id = req.params.box_id;
    console.info('Deleting user: ' + user_id + ' from box_id: ' + box_id);
    global.connection.query("UPDATE user_box SET is_admin=FALSE WHERE user_id=$1 AND box_id=$2", [user_id, box_id], 'Updating admin_user setting is admin false', function(user_box, err) {
        if (err) {
            return res.status(500).send();
        } else {
            return res.status(200).send(user_box);
        }
    });
}

function _add_user_box(req, res) {
	var email = req.params.email;
	var box_id = req.params.box_id;
    console.info('Adding user: ' + email + ' to box_id: ' + box_id);

    var user_list;
    var user_id;
    var existing;

	async.waterfall([
        function(callback) {
			global.connection.query("SELECT id FROM shiftfit_user WHERE lower(email) = lower($1)", [email], 'Checking if the email exists as an user', function(data, err) {
				if (err) {
                	return callback(res.__('internal_server_error'));
				}
				if (!data[0]) {
                	return callback(res.__('email_does_not_exists'));
				} else {
					user_id = data[0].id;
		        	return callback();
				}
            });
        },
        function(callback) {
			global.connection.query("SELECT * FROM user_box WHERE user_id=$1 AND box_id=$2", [user_id, box_id], 'Checking if the user is already registered as user_box', function(exists, err) {
		        if (err) {
            		return callback(res.__('internal_server_error'));
		        }
	        	existing = exists[0];
	            return callback();
	    	});	        		
        },
        function(callback) {
        	if (!existing) {
				global.connection.query("INSERT INTO user_box (user_id, box_id, is_admin) VALUES ($1, $2, true)", [user_id, box_id], 'Inserting new user_box', function(user_box, err) {
			        if (err) {
                		return callback(res.__('internal_server_error'));
			        }
		        	user_list = user_box;
		            return callback();
		    	});	        		
        	}
            return callback();
        },
        function(callback) {
        	if (existing) {
				global.connection.query("UPDATE user_box SET is_admin=TRUE WHERE user_id=$1 AND box_id=$2", [user_id, box_id], 'updating existing user_box', function(user_box, err) {
			        if (err) {
                		return callback(res.__('internal_server_error'));
			        }
		        	user_list = user_box;
		            return callback();
		    	});	        		
        	}
            return callback();
        }
    ],  function(err) {
            if (err) {
		        var errors = [{'type': 'general', 'param': 'none', 'msg': err}];
	        	res.status(500).send(errors);
			}
			console.info('finale');
            return res.status(200).send(user_list);
        }
    );
}

module.exports = function () {
    return {
        register : function (app) {
        	app.admin_get('/add_box_user/:box_id/:email', _add_user_box);
        	app.admin_get('/delete_box_user/:box_id/:user_id', _delete_user_box);
            app.admin_get('/userautocomplete/:key', _get);
        }
    };
};