import { fetchCategories, fetchProductsByCategory } from './helpers/mercadoLivreAPI.js';

const btnVazio = document.querySelector('.empty-cart');
const cartLista = document.querySelector('.cart__items');
const precoTotalDiv = document.querySelector('.total-price');
const carregandoContainer = document.querySelector('.carregandoContainer');

const clearProductList = () => {
  const sectionItens = document.querySelector('.items');
  sectionItens.innerHTML = '<div class="empty-message">Nenhum produto encontrado.</div>';
  productList.innerHTML = '';
};

const checkProductList = () => {
  const productList = document.querySelector('.items');
  const emptyMessage = document.querySelector('.product-list-empty');

  if (productList.children.length === 0) {
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const adicionaCar = document.querySelectorAll('.item__add');
  adicionaCar.forEach((e) => e.addEventListener('click', pegaId));

  return section;
};

const adicionaListeners = () => {
  const adicionarNoCar = document.querySelectorAll('.cart__item');
  adicionarNoCar.forEach((element) => element.addEventListener('click', cartItemClick));
};
/* const getIdFromProductItem = (product) => product.querySelector('span.id').innerText; */

const sectionItens = document.querySelector('.items');

window.onload = async () => {
  carregarRequisicao();
  const categories = await fetchCategories();
  /* console.log('Categorias obtidas:', categories); */
  const firstCategory = categories[0].id;
  const { results } = await fetchProductsByCategory(firstCategory);
  const products = results;
  /* console.log('Produtos obtidos:', products); */

  const sectionItens = document.querySelector('.items');

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
