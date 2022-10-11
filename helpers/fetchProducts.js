const fetchProducts = async (produto) => {
  // seu código aqui
    if (!produto) {
      throw new Error('You must provide an url');
    }
    const resposta = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const json = await resposta.json();
    return json;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
