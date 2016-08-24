'use strict';

/*
    {
        "codigo": "101",
        "codigoPai": null,
        "descricao": "Blá",
        "nivel": 1,
        "ehFolha": false
    },
    {
        "codigo": "10101",
        "codigoPai": "101",
        "descricao": "Serviços de construção de edificações residenciais",
        "nivel": 2,
        "ehFolha": false
    },
*/

const _ = require('lodash');
const fs = require('fs');

let src = _.clone(require('./fonte.json'));
let tabelaNbs = [];

function formatarDados(dados) {
	var dadosFormatados = _.clone(dados);
	dadosFormatados = _.sortBy(dadosFormatados, 'codigo');
	dadosFormatados = _.uniqBy(dadosFormatados, 'codigo');
	return dadosFormatados;
}

function inserirSrcNbs(expectedLength, nbs) {
	if (nbs.codigo.length === 3) {
		tabelaNbs.push({
			codigo: nbs.codigo,
			codigoPai: null,
			descricao: nbs.descricao,
			nivel: 1,
			ehFolha: false
		});
	} else if (nbs.codigo.length === expectedLength){
		let possiveisPais = _.filter(tabelaNbs, function(nbsTratado) {
			return new RegExp('^'+nbsTratado.codigo).test(nbs.codigo);
		});
		// console.log('possiveisPais: ', possiveisPais);
		let pai = {codigo:''};
		possiveisPais.forEach(possivelPai => {
			pai = possivelPai.codigo.length > pai.codigo.length ? possivelPai : pai;
		});
		if (pai && pai.codigo) {
			tabelaNbs.push({
				codigo: nbs.codigo,
				codigoPai: pai.codigo,
				descricao: nbs.descricao,
				nivel: pai.nivel+1,
				ehFolha: nbs.codigo.length === 9
			});
		} else {
			console.log(tabelaNbs.length);
			throw new Error('Não foi possível encontrar pai do NBS ' +nbs.codigo);
		}
	}
}

for (let it = 3; it <= 9; it++) {
	src.forEach(inserirSrcNbs.bind({}, it));
}

tabelaNbs = formatarDados(tabelaNbs);
console.log(src.length);
console.log(tabelaNbs.length);

// console.log(JSON.stringify(tabelaNbs, null, 4));
fs.writeFileSync('data.json', JSON.stringify(tabelaNbs, null, 4), 'utf8');

