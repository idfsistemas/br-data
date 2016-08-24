'use strict';

const _ = require('lodash');

let currentData = require('./data-ncm-v2.json');
let ncmNfe = require('./ncmNfe.json');

// dataNotInSef
console.log('NCMs em data.json inexistentes em ncmNfe.json');
let dataNotInSef = [];
currentData.forEach(function(ncm) {
	if (!ncm.ehFolha) {
		return;
	}
	let matched = _.find(ncmNfe, function(ncm8) {
		return ncm8 === ncm.codigo;
	});
	if (!matched) {
		dataNotInSef.push(ncm.codigo);
	}
});
console.log(dataNotInSef);



// sefNotInData
console.log('NCMs em ncmNfe.json inexistentes em data.json');
let sefNotInData = [];
ncmNfe.forEach(function(ncm8) {
	let matched = _.find(currentData, function(ncm) {
		return ncm8 === ncm.codigo;
	});
	if (!matched) {
		sefNotInData.push(ncm8);
	}
});
console.log(sefNotInData);
