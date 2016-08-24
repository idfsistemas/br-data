'use strict';

var path = require('path');

module.exports = {
	get: function(dataName) {
		try {
			return require('./'+path.join('data', dataName, 'data.json'));
		} catch(e) {
			return null;
		}
	},
	getHistory: function(dataName) {
		try {
			return require('./'+path.join('data', dataName, 'history.json'));
		} catch(e) {
			return null;
		}
	}
};
