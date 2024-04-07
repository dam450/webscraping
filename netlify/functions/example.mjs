/**
 * @param {Request} req - O objeto de requisição HTTP.
 * @param {import("@netlify/functions").Context} context - O contexto da função.
 * @returns {Response} - Uma resposta HTTP.
 */
export default async function (req, context) {
  const { city, country } = context.params;

  // console.log("body: ", req.json()); // req.body

  req.json().then((data) => console.log("data: ", data));

  return new Response(`You're visiting ${city} in ${country}!`, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

/**
 * Configurações para a rota "/travel/:city/:country".
 * @type {import("@netlify/functions").Config}
 */
export const config = {
  path: "/travel/:city/:country",
};

/**
 * get .env vars in Netlify
 * const apiKey = Netlify.env.get("MY_API_KEY");
 *
 * get params: defined by path -> '/api/property/:url'
 * let { url } = context.params;
 *
 * get query: defined by 'searchParams' -> '?query=...'
 * query = new URL(req.url).searchParams.get("query");
 *
 * get body: defined by 'json'
 * req.json().then((data) => console.log("data: ", data));
 */
