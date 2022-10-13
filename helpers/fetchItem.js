const fetchItem = (id) => {
  // seu código aqui
  try {
    const resposta = await (fetch`https://api.mercadolibre.com/sites/MLB/search?q=computadorhttps://api.mercadolibre.com/items/${id}`);
    const json = await (resposta.json());
    return json;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
