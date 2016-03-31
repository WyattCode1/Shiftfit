'use strict';

var _ = require('lodash');
var fs = require('fs');



function _get(req, res) {
	var id = req.params.id;
	console.log('Show photo id: ' + id);

	global.connection.query('select_pricture_user_byid', [id], "Select picture user", function (picture, err) {
		if (err) {
			console.info("Exception: " + err);
			var errors = [{'type':'general', 'param': 'none', 'msg': res.__('general_error')}];
			res.status(500).send(errors);
		}
		
		res.setHeader('Content-Type', picture[0].picture_type );
		res.setHeader('Content-Length', picture[0].picture_file.length );
		console.info( picture[0].picture_type);
		return res.send(new Buffer(picture[0].picture_file));
	});
}


module.exports = function () {
	return {
		register : function (app) {
			app.get('/picture_get/:id?', _get);
		}
	};
};