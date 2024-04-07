import * as cheerio from "cheerio";

/**
 * A function that checks if a given string is a valid URL.
 *
 * @param {string} urlString - The URL string to be checked.
 * @return {boolean} Returns true if the string is a valid URL, false otherwise.
 */
const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

/**
 * Netlify function to get property data.
 *
 * @param {Request} req - O objeto de requisição HTTP.
 * @param {import("@netlify/functions").Context} context - O contexto da função.
 * @returns {Response} - Uma resposta HTTP.
 */
export default async (req, context) => {
  // show request id
  console.log(`REQUEST ID: ${context.requestId}`);

  // get url query param
  const urlQueryParam = new URL(req.url).searchParams.get("url");

  // check if url is valid
  if (!isValidUrl(urlQueryParam))
    return new Response(JSON.stringify({ error: "Invalid url information" }), {
      status: 400,
    });

  //get hostname from url
  const { hostname } = new URL(urlQueryParam);

  // check hostname is correct
  if (hostname !== "www.rkimoveis.com.br") {
    return new Response(JSON.stringify({ error: "Invalid hostname" }), {
      status: 412,
    });
  }

  const url = urlQueryParam;

  const $ = cheerio.load(
    await fetch(url)
      .then((res) => res.text())
      .catch((err) => console.log(err))
  );

  const pageNotFound =
    $(".titulo-principal").text() === "Página não encontrada";

  if (pageNotFound)
    return new Response(JSON.stringify({ error: "Property Not found" }), {
      status: 404,
    });

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

  // console.log(`Código do Imóvel: ${codigoImovel}`);
  // console.log(`Local: ${local}`);
  // console.log(`Valor do Imóvel: ${valorImovel}`);
  // console.log(`Nome do Condomínio: ${nomeCondominio}`);
  // console.log(`Descrição: ${descImovel}`);
  // console.log(`Metragem: ${metragem}`);
  // console.log(
  //   `quartos: ${quartos}, banheiros: ${banheiros}, garagem: ${garagem}`
  // );

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

  // retornar os dados
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Configurações para a rota "/api/property/:url".
 * @type {import("@netlify/functions").Config}
 */
export const config = {
  path: ["/api/property", "/api/property/:url"],
  preferStatic: true,
};

/**
 *  install netlify-cli to run locally: npm install -g netlify-cli
 *  run server: netlify dev
 */
