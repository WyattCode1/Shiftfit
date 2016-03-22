"use strict";

var _ = require('lodash');

function _get(object_id, callback) {
    global.connection.query('SELECT * FROM box WHERE id = $1', [object_id], 'Getting box to edit: ' + object_id, function (box, err1) {
        if (err1) {
            return callback();
		} else {
	    	global.connection.query('select_user_box_list', [box[0].id], "Getting all the admin users of the box", function (user_box, err2) {
				if (err2) {
					return callback();
				}
		        var merge = _.merge({'box_info': box[0]}, {'user_box_list': user_box});
				return callback(merge);
	        });
		}
    });
}

function _save(req, callback) {
	var name = req.body.name;
	var address = req.body.address;
	var phone = req.body.phone;
	var payment_method = req.body.payment_method;

	var insert_query = 'INSERT INTO box (id, name, address, phone, payment_method) VALUES (nextval(\'box_sequence\'), $1, $2, $3, $4) RETURNING id';
    global.connection.query(insert_query, [name, address, phone, payment_method], "Inserting new box", function (box, err) {
        if (err) {
            return callback();
        }
        return callback(box[0]);
    });
}

function _update(req, callback) {
	var object_id = req.params.domainId;
	var name = req.body.name;
	var address = req.body.address;
	var phone = req.body.phone;
	var payment_method = req.body.payment_method;

	var update_query = 'UPDATE box set name=$2, address=$3, phone=$4, payment_method=$5 WHERE id = $1 returning id';
    global.connection.query(update_query, [object_id, name, address, phone, payment_method], "Updating box", function (box, err) {
        if (err) {
            return callback();
        }
        return callback(box[0]);
    });
}

function _delete(req, callback) {
	var box_id = req.params.domainId;
	global.connection.query('UPDATE user_box SET is_admin=FALSE WHERE box_id = $1', [box_id], "Removing admin function of all the user in the box", function (box, err1) {
        if (err1) {
            return callback();
        }
	    global.connection.query('DELETE FROM box WHERE id = $1 returning id', [box_id], "Deleting box", function (box, err2) {
	        if (err2) {
	            return callback();
	        }
	        return callback(box[0].id);
	    });
    });
}

function _get_all(callback) {
    global.connection.query('SELECT * FROM box ORDER BY name', null, "Getting all the boxes", function (box, err) {
		if (err) {
			return callback();			
		}
		return callback(box);
    });
}

module.exports = function() {
    return {
        get     : _get,
        save    : _save,
        update  : _update,
        delete  : _delete,
        get_all : _get_all
    };
};