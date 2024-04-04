import * as cheerio from "cheerio";

const url =
  "https://www.rkimoveis.com.br/imovel/venda/villagio-di-siena-apartamento-semi-mobiliado-com-02-dormitorios-sendo-01-suite/9323";

// Acessar a página
async function getPropertiesData() {
  // Extrair o HTML da página
  const $ = cheerio.load(
    await fetch(url)
      .then((res) => res.text())
      .catch((err) => console.log(err))
  );

  // Extrair o código do imóvel
  const codigoImovel = $("b#cod-principal").text().split(":")[1].trim();
  const local = $(".sub-titulo").text().trim().split(",")[0].trim();

  // Extrair o valor do imóvel
  const valorImovel = $(".preco-imovel-mobile").text().trim();

  // Extrair o nome do condomínio
  const nomeCondominio = $(
    "div.row.margin-top-20 .col-12 .descricao:last"
  ).text();

  const descImovel = $("div.row.margin-top-20 .col-12 .descricao:first")
    .text()
    .replace(/(\r\n|\n|\r)/gm, " ")
    .trim();

  const metragem = $(".icon_detalhes p:first").text().trim();
  const quartos = $(".icon_detalhes p:nth(2)").text().trim().split(" ")[0];
  const banheiros = $(".icon_detalhes p:nth(3)").text().trim().split(" ")[0];
  const garagem = $(".icon_detalhes p:nth(4)").text().trim().split(" ")[0];

  // Imprimir os dados
  /*
  console.log(`Código do Imóvel: ${codigoImovel}`);
  console.log(`Local: ${local}`);
  console.log(`Valor do Imóvel: ${valorImovel}`);
  console.log(`Nome do Condomínio: ${nomeCondominio}`);
  console.log(`Descrição: ${descImovel}`);
  console.log(`Metragem: ${metragem}`);
  console.log(
    `quartos: ${quartos}, banheiros: ${banheiros}, garagem: ${garagem}`
  );
  */

  // gerar json com os dados

  const data = {
    propertyID: codigoImovel,
    local: local,
    value: valorImovel,
    propertyName: nomeCondominio,
    description: descImovel,
    meters: metragem,
    rooms: quartos,
    bathroom: banheiros,
    garage: garagem,
  };

  console.table("dados: ", data);
}

getPropertiesData();
