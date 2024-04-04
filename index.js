const cheerio = require("cheerio");

const url =
  "https://www.rkimoveis.com.br/imovel/venda/apartamento-a-venda-2-quartos-2-suites-2-vagas-ingleses-florianopolis-sc/7924";

// Acessar a página
fetch(url)
  .then((response) => response.text()) // Extrair o corpo da resposta como texto
  .then((body) => {
    // Extrair o HTML da página
    const $ = cheerio.load(body);

    // Extrair o código do imóvel
    const codigoImovel = $("b#cod-principal").text().split(":")[1].trim();

    // Extrair o valor do imóvel
    const valorImovel = $("h6.preco-imovel").text();

    // Extrair o nome do condomínio
    const nomeCondominio = $("h2.titulo-condominio").text();

    const descImovel = $("p.descricao").text();

    // Imprimir os dados
    console.log(`Código do Imóvel: ${codigoImovel}`);
    console.log(`Valor do Imóvel: ${valorImovel}`);
    console.log(`Nome do Condomínio: ${nomeCondominio}`);
    console.log(`Descrição: ${descImovel}`);
  })
  .catch((error) => console.error(error)); // Tratar erros na requisição;
