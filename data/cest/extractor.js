const fs = require('fs');

var fileContent = fs.readFileSync('source.txt', 'utf8').split('\n');
var cols = {
	numeroAnexo: 0,
	descAnexo: 1,
	item: 2,
	cest: 3,
	ncm: 4,
	descricao: 5
};
var cests = [];

console.log('Linhas do arquivo fonte:', fileContent.length);

fileContent.forEach(linha => {
	var campos = linha.split('\t');
	if ((!campos[cols.cest] && !campos[cols.ncm]) || campos[cols.ncm] === 'NCM/SH') {
		// Linhas que não possuem CEST nem NCM ou é um cabeçalho devem ser ignoradas
		return;
	} else if (!campos[cols.cest]) {
		// Linhas que não tem CEST mas tem NCM complementam a linha anterior
		var anterior = cests[cests.length-1];
		anterior.ncms.push(campos[cols.ncm].replace(/\./g, ''));
		return;
	}
	var ncm = campos[cols.ncm];
	var ncms = [];

	if (/Capítulo|Capítulos/.test(ncm)) {
		// Tratar celula de NCM especificando capitulos
		ncms = ncm.replace(/Capítulos|Capítulo/, '').replace(/ /g, '').split(/[,e]/);
	} else if (ncm) {
		ncms = [ncm.replace(/\./g, '')];
	}

	var cest = {
		numeroAnexo: campos[cols.numeroAnexo],
		descAnexo: campos[cols.descAnexo],
		item: campos[cols.item],
		cest: campos[cols.cest].replace(/\./g, ''),
		ncms: ncms,
		descricao: campos[cols.descricao]
	};
	cest.numeroAnexo = cest.numeroAnexo.replace('ANEXO', 'Anexo');
	cest.descAnexo = cest.descAnexo.substr(0,1) + cest.descAnexo.substr(1).toLowerCase();
	cests.push(cest);
	return;
});

fs.writeFileSync('data.json', JSON.stringify(cests, null, 4), 'utf8');
