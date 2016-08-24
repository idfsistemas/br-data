br-data
=======

Pacote de arquivos de dados nacionais em formato JSON.

O objetivo desse repositório é centralizar em um único lugar de forma organizada e padronizada as tabelas de dados
fornecidas pelos órgãos públicos brasileiros. E dessa forma facilitar a utilização desses dados em sistemas de TI.

## Tabela de Dados Disponíveis

Tabela | Descrição
------ | ---------
**NCM** | _Nomenclatura Comum do Mercosul_ utilizada obrigatoriamente desde 01/01/2010 para categorizar os produtos em documentos fiscais [_Ver receita.fazenda.gov.br_](http://www4.receita.fazenda.gov.br/simulador/PesquisarNCM.jsp)
**CEST** | _Código Especificador da Substituição Tributária_ criado para estabelecer uma sistemática de uniformização e identificação das mercadorias e bens que são passíveis de Substituição Tributária e antecipação de ICMS. Ele é usado documentos fiscais conforme o [Convênio ICMS 92, de 20 de agosto de 2015](https://www.confaz.fazenda.gov.br/)
**NBS** | _Nomenclatura Brasileira de Serviços_, intangíveis e outras operações que produzam variações no patrimônio ([_Ver mdic.gov.br_](http://www.mdic.gov.br/comercio-servicos/a-secretaria-de-comercio-e-servicos-scs-13))

## Formato dos arquivos

Os arquivos de dados estão disponibilizados na pasta `data\<nome dos dados>` e separados em três arquivos diferentes. 
Sendo que todos eles utilizam codificação **UTF-8** e o caracter **LF** como quebra de linha (_padrão UNIX_).

### _data.json_:

Arquivo JSON contendo um array de objetos onde cada objeto representa uma linha da tabela de dados

### _data.csv_:

Arquivo CSV contendo o mesmo conteúdo do arquivo `data.json` utilizando _vírgula_ (`,`) como separador de colunas
e _aspas duplas_ (`"`) em campos de texto.

### _history.json_:

Arquivo JSON contendo um array de objetos. Ao atualizar o `data.json` deverá ser adicionado
um item no inicio desse array contendo as propriedades:

Campo | Descricao
----- | ---------
`dataDeAtualizacao` | Data da atualização do arquivo. _Ex.: `"2016-08-17"`_
`descricao` | Descrição da atualização realizada explicando citando a fonte utilizada. _Ex.: `"Atualizado até os convênios ICMS 92/2015, 139/15, 146/15, 16/16, 53/16."`_
`referencias` | Array com as urls de uma ou mais referências utilizadas como base para a atualização. _Ex.: `["https://investexportbrasil.dpr.gov.br/ProdutosServicos/frmPesquisaProdutosServicosFull.aspx"]`_
`dataDePublicacao` | Data da publicação da referência mais recente utilizada na atualização. _Ex.: `"2016-08-01"`_

## Utilizando os dados

### Através da API Javascript

**Instale utilizando npm:**

```shell
npm install --save br-data-json
```

**Exemplo de uso:**

```javascript
const brData = require('br-data-json');

// Recebe como parametro o nome da pasta de dados e retorna o conteúdo json do arquivo `data.json`
const ncms = brData.get('ncm');

// Recebe como parametro o nome da pasta de dados e retorna o conteúdo json do arquivo `history.json`
const ncmsHistory = brData.getHistory('ncm');
```

### Importando os dados na sua base

Você também pode importar os dados dos arquivos `data.json` ou `data.csv` diretamente na base de dados do seu sistema.

## Contribuíndo

Solicitamos todo apoio possível para manter os dados atualizados. Esperamos receber _pull requests_ contendo atualizações
dos arquivos existentes e novos arquivos de dados. Pedimos apenas atenção para que padrão de **Formato dos arquivos**
especificado nesse _readme_ seja sempre atendido.

**_Coverter JSON para CSV:_**

Se você criou/alterou um arquivo `data.json`, não se esqueça de criar/atualizar a versão em CSV do mesmo antes de enviar
o _pull request_.

Para fazer isso sugerimos usar a biblioteca [zemirco/json2csv](https://github.com/zemirco/json2csv)
instalando-a globalmente com `npm -g json2csv`. Feito isso basta executar o comando abaixo no diretório do arquivo
`data.json` substituindo o parametro passado em `-f` pela lista de colunas desejada:

```shel
json2csv -i data.json -f codigo,codigoPai,descricao,nivel,ehFolha -o data.csv
```
