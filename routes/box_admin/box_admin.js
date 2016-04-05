'use strict';

var _ = require('lodash');

function _get(req, res) {
	console.info('Loading box admin');
	res.sendPage("box_admin");
}

module.exports = function () {
	return {
		register : function (app) {
			app.get('/myboxes', _get);
		}
	};
};