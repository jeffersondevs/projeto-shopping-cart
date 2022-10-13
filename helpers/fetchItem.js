const fetchItem = async (id) => {
  // seu código aqui
  try {
    const resposta = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const json = await resposta.json();
    return json;
  } catch (error) {
    throw new Error('You must provide an url');
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
