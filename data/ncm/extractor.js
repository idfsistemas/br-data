'use strict';

const _ = require('lodash');
const req = require('request');
const fs = require('fs');

class NcmLoader {
	constructor(tempFile) {
		this.tempFile = tempFile || 'temp-file.json';
		this.capitulosUrl = 'https://corporativo.dpr.gov.br/ProdutosServicos/ListarCapitulos';
		this.filhosUrl = 'https://corporativo.dpr.gov.br/ProdutosServicos/ListarFilhos';
		this.buffer = {
			ncms: [],
			novosNcms: []
		};
	}

	loadTempFile() {
		try {
			let content = fs.readFileSync(this.tempFile, 'utf8');
			this.buffer = JSON.parse(content);
		} catch (err) {
			console.log(err);
		}
	}

	updateTempFile() {
		fs.writeFileSync(this.tempFile, JSON.stringify(this.buffer, null, 4), 'utf8');
	}

	obterCapitulos() {
		if (this.buffer.ncms.length || this.buffer.novosNcms.length) {
			return Promise.resolve();
		}

		var deferred = Promise.defer();
		console.log(' [...] Obtendo capitulos de NCM');
		req.get({
			uri: this.capitulosUrl,
			qs: {idioma: 'pt-br', tipo: 'NCM'}
		}, (err, response, body) => {
			if (err) {
				return deferred.reject(err);
			}
			this.buffer.novosNcms = this.buffer.novosNcms.concat(JSON.parse(body));
			console.log(' [ v ] '+this.buffer.novosNcms.length+' Capitulos de NCM obtidos!');
			deferred.resolve();
		});

		return deferred.promise;
	}

	tratarNovoNcm() {
		if (!this.buffer.novosNcms.length) {
			return Promise.resolve(false);
		}

		var ncm = this.buffer.novosNcms.pop();
		// console.log('       > Tratando NCM: ', ncm.Codigo, ncm.Nivel, ncm.TemFilhos, ncm.Descricao);

		var ncmTratado = (newNcm) => {
			// console.log('       > NCM Obtido: ', ncm.Codigo);
			this.buffer.ncms.push(newNcm);
			try {
				this.updateTempFile();
			} catch(err) {
				return Promise.reject(err);
			}
			return Promise.resolve(newNcm);
		};

		if (!ncm.TemFilhos) {
			return ncmTratado(ncm);
		}

		var deferred = Promise.defer();

		setTimeout(() => {
			req.get({
				headers: {
					'Content-type': 'application/json',
					'Accept': 'application/json'
				},
				method: 'GET',
				uri: this.filhosUrl,
				qs: {idioma: 'pt-br', codigo: ncm.Codigo},
				timeout: 3000
			}, (err, response, body) => {
				if (err) {
					return deferred.reject(err);
				}
				this.buffer.novosNcms = this.buffer.novosNcms.concat(JSON.parse(body));
				return deferred.resolve(ncmTratado(ncm));
			});
		}, 2000);

		return deferred.promise;
	}

	tratarNovosNcms() {
		return this.tratarNovoNcm().then(ncm => {
			if (ncm) {
				console.log(' [ i ] NCMs Obtidos:', this.buffer.ncms.length, '  Novos NCMs:', this.buffer.novosNcms.length, '  NCM tratado:', ncm.Codigo);
				return this.tratarNovosNcms();
			} else {
				console.log(' [ V ] Novos NCMs: ', this.buffer.novosNcms.length, 'NCMs Obtidos: ', this.buffer.ncms.length);
				return Promise.resolve();
			}
		});
	}

	formatarNcms() {
		var ncmsFormatados = _.reduce(this.buffer.ncms, (result, value, key) => {
			result.push({
				codigo: value.Codigo,
				codigoPai: value.CodigoPai,
				descricao: value.Descricao,
				nivel: value.Nivel,
				ehFolha: !value.TemFilhos
			});
			return result;
		}, []);
		ncmsFormatados = _.sortBy(ncmsFormatados, 'codigo');
		ncmsFormatados = _.uniqBy(ncmsFormatados, 'codigo');
		return ncmsFormatados;
	}

	loadNcms() {
		this.loadTempFile();

		return this.obterCapitulos().then(() => {
			return this.tratarNovosNcms().then(() => {
				var ncmsFormatados = this.formatarNcms();
				fs.writeFileSync('ncm.json', JSON.stringify(ncmsFormatados, null, 4), 'utf8');
				return ncmsFormatados;
			});
		});
	}
}

var ncmLoader = new NcmLoader();
var numErrors = 0;

function concluido(ncms) {
	console.log('CONCLUIDO!');
	console.log('Total de NCMs exportados: ', ncms.length);
}

function tentarObterNcms() {
	return ncmLoader.loadNcms().then(concluido, function(err) {
		numErrors++;
		console.log('ERRO ', numErrors, ':(', err);
		if (numErrors > 1000) {
			throw err;
		}

		var deferred = Promise.defer();
		setTimeout(function() {
			console.log('Tentando novamente... :) ');
			deferred.resolve(tentarObterNcms());
		}, 3000);
		return deferred.promise;
	});
}

tentarObterNcms().catch(function(err) {
	console.log(err);
	throw err;
});
