'use strict';

/*
101 Serviços de construção
102 Serviços de distribuição de mercadorias, serviços de despachante aduaneiro
103 Fornecimento de alimentação e bebidas e serviços de hospedagem
104 Serviços de transporte de passageiros
105 Serviços de transporte de cargas
106 Serviços de apoio aos transportes
107 Serviços postais, serviços de coleta, remessa ou entrega de documentos (exceto cartas) ou de pequenos objetos, serviços de remessas expressas
108 Serviços de transmissão e distribuição de eletricidade, serviços de distribuição de gás e água
109 Serviços financeiros e relacionados, securitização de recebíveis e fomento comercial

110 Serviços imobiliários
1100
1109

111 Arrendamento mercantil operacional, propriedade intelectual, franquias empresariais e exploração de outros direitos
112 Serviços de pesquisa e desenvolvimento
113 Serviços jurídicos e contábeis
114 Outros serviços profissionais
115 Serviços de tecnologia da informação
117 Serviços de telecomunicação, difusão e fornecimento de informações
118 Serviços de apoio às atividades empresariais
119 Serviços de apoio às atividades agropecuárias, silvicultura, pesca, aquicultura, extração mineral, eletricidade, gás e água

120 Serviços de manutenção, reparação e instalação (exceto construção)
1200

121 Serviços de publicação, impressão e reprodução
121011
121012
121013
121019
1219

122 Serviços educacionais
123 Serviços relacionados à saúde humana e de assistência social
124 Serviços de tratamento, eliminação e coleta de resíduos sólidos, saneamento, remediação e serviços ambientais
125 Serviços recreativos, culturais e desportivos
126 Serviços pessoais
127 Cessão de direitos de propriedade intelectual
*/

const fs = require('fs');
const _ = require('lodash');

const nbsData = require('./data-nbs.json');
const ncmData = require('./data.json');
const nbsStarts = [/^101/,/^102/,/^103/,/^104/,/^105/,/^106/,/^107/,/^108/,/^109/,/^1100/,/^1109/,/^111/,/^112/,
					/^113/,/^114/,/^115/,/^117/,/^118/,/^119/,/^1200/,/^121011/,/^121012/,/^121013/,/^121019/,
					/^1219/,/^122/,/^123/,/^124/,/^125/,/^126/,/^127/];
var newNcmData = [];
var newNbsData = [];
var contNcmFolha = 0;

function isNbs(ncm) {
	let isNbs = false;
	if (ncm.codigoPai === '121') {
		return true;
	}
	nbsStarts.forEach(nbsStart => {
		isNbs = isNbs || nbsStart.test(ncm.codigo);
	});
	return isNbs;
}

function formatarDados(dados) {
	var dadosFormatados = _.clone(dados);
	dadosFormatados = _.sortBy(dadosFormatados, 'codigo');
	dadosFormatados = _.uniqBy(dadosFormatados, 'codigo');
	return dadosFormatados;
}


ncmData.forEach(ncm => {
	if (isNbs(ncm)) {
		newNbsData.push(ncm);
	} else {
		newNcmData.push(ncm);
		contNcmFolha += ncm.ehFolha ? 1 : 0;
	}
});

newNbsData = formatarDados(newNbsData);
newNcmData = formatarDados(newNcmData);

console.log(ncmData.length);
console.log(newNcmData.length, 'folhas: ', contNcmFolha);
console.log(nbsData.length);
console.log(newNbsData.length);


fs.writeFileSync('data-ncm-v2.json', JSON.stringify(newNcmData, null, 4), 'utf8');
fs.writeFileSync('data-nbs-v2.json', JSON.stringify(newNbsData, null, 4), 'utf8');
