'use strict';

import test from 'ava';

const fs = require('fs');
const path = require('path');
const brData = require('../index');

var folderNames = [];

test.before('loading folder names', t => {
	let srcpath = '../data';
	folderNames = fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
	console.log('Diretórios encontrados:', folderNames);
});

test('should get all datas', t => {
	folderNames.forEach(folderName => {
		let data = brData.get(folderName);
		let hasData = data && data.length > 0;
		t.true(hasData, 'Diretório com arquivo de dados JSON inválido: "data/'+ folderName +'"');
	});
	return;
});

test('should get all histories', t => {
	folderNames.forEach(folderName => {
		let history = brData.getHistory(folderName);
		let hasHistory = history && history.length > 0;
		t.true(hasHistory, 'Diretório com arquivo de histórico inválido: "data/'+ folderName +'"');

		history.forEach((item, k) => {
			t.true(!!item.dataDeAtualizacao,
				'Item '+k+' do histórico em "data/'+ folderName + '" não possui o campo "dataDeAtualizacao"');
			t.true(!!item.descricao,
				'Item '+k+' do histórico em "data/'+ folderName + '" não possui o campo "descricao"');
			t.true(!!item.referencias,
				'Item '+k+' do histórico em "data/'+ folderName + '" não possui o campo "referencias"');
			t.true(!!item.dataDePublicacao,
				'Item '+k+' do histórico em "data/'+ folderName + '" não possui o campo "dataDePublicacao"');
		});
	});
	return;
});

test('should has csv versions', t => {
	let srcpath = '../data';
	folderNames.forEach(folderName => {
		let hasCsv = false;
		try {
			hasCsv = fs.statSync(path.join(srcpath, folderName, 'data.csv')).isFile();
		} catch(err) {
			console.log(err.message);
		}
		t.true(hasCsv, 'Diretório com arquivo de dados CSV inválido: "data/'+ folderName +'"');
	});
	return;
});
