const API_URL = 'https://api.mercadolibre.com';

const fetchCategories = async (id) => {
  const response = await fetch(`${API_URL}/sites/MLB/categories`);
  const data = await response.json();
  return data;
};

const fetchProductsByCategory = async (categoryId) => {
  const response = await fetch(`${API_URL}/sites/MLB/search?category=${categoryId}`);
  const data = await response.json();
  return data;
};

export const fetchProdutcsByQuery = async (query) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await response.json();
  return data;
};


export { fetchCategories, fetchProductsByCategory/* , fetchProdutcsByQuery  */};
