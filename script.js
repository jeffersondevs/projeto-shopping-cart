import { 
  fetchCategories, 
  fetchProductsByCategory, 
  fetchProdutcsByQuery,
} from './helpers/mercadoLivreAPI.js';
import { fetchItem } from './helpers/fetchItem.js';

const btnVazio = document.querySelector('.empty-cart');
const cartLista = document.querySelector('.cart__items');
const precoTotalDiv = document.querySelector('.total-price');
const carregandoContainer = document.querySelector('.carregandoContainer');
const selectCategories = document.querySelector('.categories-list');
const emptyMessage = document.querySelector('.product-list-empty');
const productList = document.querySelector('.items');
const sectionItens = document.querySelector('.items');
const formPesquisa = document.querySelector('.section-pesquisa');
const sortOrderSelect = document.querySelector('.sort-order');

const sortProducts = (products, sortOrder) => {
  if (sortOrder === 'price_asc') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    return products.sort((a, b) => b.price - a.price);
  }
  return products;
};

sortOrderSelect.addEventListener('change', async (event) => {
  const sortOrder = event.target.value;

  // Obter a lista atual de produtos (por categoria ou pesquisa)
  const currentCategory = selectCategories.value;
  const currentQuery = document.querySelector('#pesquisaInput').value;

  let products;
  if (currentCategory) {
    const { results } = await fetchProductsByCategory(currentCategory);
    products = results;
  } else if (currentQuery) {
    const { results } = await fetchProdutcsByQuery(currentQuery);
    products = results;
  }

  // Ordenar produtos
  const sortedProducts = sortProducts(products, sortOrder);

  // Limpar a lista de produtos
  sectionItens.innerHTML = '';

  // Atualizar a lista de produtos com os produtos ordenados
  if (sortedProducts.length === 0) {
    clearProductList();
  } else {
    sortedProducts.forEach((element) => {
      sectionItens.appendChild(createProductItemElement(element));
    });
  }

  checkProductList();
});

formPesquisa.addEventListener('submit', async (event) => {
  event.preventDefault();

  const pesquisaInput = document.querySelector('#pesquisaInput');
  const query = pesquisaInput.value;

  const { results } = await fetchProdutcsByQuery(query);
  const products = results;

  productList.innerHTML = ''; // Limpa a lista de produtos

  if (products.length === 0) {
    clearProductList();
  } else {
    products.forEach((element) => {
      productList.appendChild(createProductItemElement(element));
    });
  }

  checkProductList();
});


const showCategories = async () => {
  const categories = await fetchCategories(); // Função que busca as categorias da API
  const categoriesList = document.querySelector('.categories-list');

  categories.forEach((category) => {
    const categoryOption = document.createElement('option');
    categoryOption.value = category.id;
    categoryOption.innerText = category.name;
    categoriesList.appendChild(categoryOption);
  });
};

showCategories();

selectCategories.addEventListener('change', async (event) => {
  const categoryId = event.target.value;
  const { results } = await fetchProductsByCategory(categoryId);
  const products = results;

  sectionItens.innerHTML = ''; // Limpa a lista de produtos

  if (products.length === 0) {
    clearProductList();
  } else {
    products.forEach((element) => {
      sectionItens.appendChild(createProductItemElement(element));
    });
  }
  
  checkProductList();
});
const clearProductList = () => {
  productList.innerHTML = '';
  productList.insertAdjacentHTML('beforeend', '<div class="empty-message">Nenhum produto encontrado.</div>');
};

const checkProductList = () => {  
  if (productList && productList.children.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }
};

const carregarRequisicao = () => {
  const elemento = document.createElement('span');
  elemento.className = 'loading';
  /* elemento.innerText = 'carregando...'; */
  carregandoContainer.appendChild(elemento);
};

const deletaCarregamento = () => {
  carregandoContainer.innerHTML = null;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const atualizaPreco = () => {
  const items = document.querySelectorAll('.cart__item');
  const itemsArray = Array.from(items);
  const precoTotal = itemsArray.reduce((e, valor) => e + Number(valor.innerText.split('$')[1]), 0);
  precoTotalDiv.innerText = precoTotal;
};

const atualizaLocal = (item) => {
  if (localStorage.cartItems) {
    const saveLocalStorage = JSON.parse(getSavedCartItems());
    saveLocalStorage.push(item);
    saveCartItems(JSON.stringify(saveLocalStorage));
    return;
  }
  saveCartItems(JSON.stringify([item]));

  
};

const cartItemClick = (item) => {
  item.target.remove();
  const totalItems = JSON.parse(getSavedCartItems());
  const index = totalItems.indexOf(item);
  totalItems.splice(index, 1);
  saveCartItems(JSON.stringify(totalItems));
  atualizaPreco();
};

const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClick);
  return li;
};

const recuperaLocal = () => {
  const saveLocalStorage = JSON.parse(getSavedCartItems());
  saveLocalStorage.forEach((element) => {
    cartLista.appendChild(createCartItemElement(element));
  });
};

btnVazio.addEventListener('click', () => {
  cartLista.innerHTML = null;
  localStorage.removeItem('cartItems');
});

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const pegaId = ({ target }) => {
  const id = target.parentNode.firstChild.innerText;
  fetchItem(id).then((e) => {
    cartLista.appendChild(createCartItemElement(e));
    atualizaPreco();
    atualizaLocal(e);
    carregarRequisicao();
  });
  deletaCarregamento();
};

const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item_id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  
  const btnAdicionar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAdicionar.addEventListener('click', pegaId);

  section.appendChild(btnAdicionar);

  return section;
};

const adicionaListeners = () => {
  const adicionarNoCar = document.querySelectorAll('.cart__item');
  adicionarNoCar.forEach((element) => element.addEventListener('click', cartItemClick));
};
/* const getIdFromProductItem = (product) => product.querySelector('span.id').innerText; */


window.onload = async () => {
  carregarRequisicao();
  const categories = await fetchCategories();
  const firstCategory = categories[0].id;
  const { results } = await fetchProductsByCategory(firstCategory);
  const products = results;

  if (products.length === 0) {
    clearProductList();
  } else {
    products.forEach((element) => {
      sectionItens.appendChild(createProductItemElement(element));
    });
  } 

    deletaCarregamento();

  if (localStorage.cartItems) {
    recuperaLocal();
  }
  atualizaPreco();
  adicionaListeners();

  checkProductList();
};