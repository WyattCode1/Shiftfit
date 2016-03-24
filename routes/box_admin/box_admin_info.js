'use strict';

var _ = require('lodash');

function _get_information(req, res) {
    console.info('Loading box admin information');
	var box_id = req.params.box_id;

	var select_box_information = 'SELECT * FROM box WHERE id = $1';
	global.connection.query(select_box_information, [box_id], "Select box information", function (box_information, err) {
		if (err) {
			var errors = [{'type':'general', 'param': 'none', 'msg': res.__('general_error')}];
			res.status(500).send(errors);
		}
		req.merge = _.merge(req.merge, {'box_information': box_information[0]});
    	res.sendPartialPage("box_admin_info");
	});
}

function _save_information(req, res) {
	req.assert('box_name', res.__('box_name') + ' ' + res.__('is_required')).notEmpty();
	req.assert('address', res.__('address') + ' ' + res.__('is_required')).notEmpty();
	req.assert('phone', res.__('phone') + ' ' + res.__('is_required')).notEmpty();
    req.assert('phone', res.__('only_phone_req')).phone();

	var errors = req.validationErrors();
	if(errors) {
		console.info(errors);
		var errors = [{'type':'general', 'param': 'none', 'msg':errors[0].msg}];
		res.status(500).send(errors);
	} else {
		var box_id = req.params.box_id;
		var name = req.body.box_name;
		var address = req.body.address;
		var phone = req.body.phone;
		var payment_method = req.body.payment_method;
	
		var update_query = 'UPDATE box set name=$2, address=$3, phone=$4, payment_method=$5 WHERE id = $1 returning id';
	    global.connection.query(update_query, [box_id, name, address, phone, payment_method], "Updating box", function (box, err) {
	        if (err) {
				var errors = [{'type':'general', 'param': 'none', 'msg': res.__('general_error')}];
				res.status(500).send(errors);
	        }
			res.status(200).send();
	    });
	}
}

module.exports = function () {
    return {
        register : function (app) {
            app.login_get('/box_admin_info/:box_id', _get_information);
            app.login_post('/save_box_information/:box_id', _save_information);
        }
    };
};