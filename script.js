import {
  fetchCategories,
  fetchProductsByCategory,
  fetchProdutcsByQuery,
} from './helpers/mercadoLivreAPI.js';
import { fetchItem } from './helpers/fetchItem.js';
import {
  getSavedCartItems,
  saveCartItems,
} from './helpers/localStorageHandlers.js';

const DOM = {
  btnVazio: document.querySelector('.empty-cart'),
  cartLista: document.querySelector('.cart__items'),
  precoTotalDiv: document.querySelector('.total-price'),
  carregandoContainer: document.querySelector('.carregandoContainer'),
  selectCategories: document.querySelector('.categories-list'),
  emptyMessage: document.querySelector('.product-list-empty'),
  productList: document.querySelector('.items'),
  sectionItens: document.querySelector('.items'),
  formPesquisa: document.querySelector('.section-pesquisa'),
  sortOrderSelect: document.querySelector('.sort-order'),
};

const toggleLoading = (isLoading) => {
  if (isLoading) {
    DOM.carregandoContainer.classList.remove('hide');
  } else {
    DOM.carregandoContainer.classList.add('hide');
  }
};

const toggleEmptyMessage = (isEmpty) => {
  DOM.emptyMessage.style.display = isEmpty ? 'block' : 'none';
};

const sortProducts = (products, sortOrder) => {
  if (sortOrder === 'price_asc') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    return products.sort((a, b) => b.price - a.price);
  }
  return products;
};

const clearProductList = () => {
  DOM.productList.innerHTML = '';
  DOM.productList.insertAdjacentHTML(
    'beforeend',
    '<div class="empty-message">Nenhum produto encontrado.</div>'
  );
};

const checkProductList = () => {
  toggleEmptyMessage(!DOM.productList || DOM.productList.children.length === 0);
};

const updateProductList = async (category = null, query = null) => {
  let products = [];
  toggleLoading(true);

  if (category) {
    const { results } = await fetchProductsByCategory(category);
    products = results;
  } else if (query) {
    const { results } = await fetchProdutcsByQuery(query);
    products = results;
  }

  const sortOrder = DOM.sortOrderSelect.value;
  const sortedProducts = sortProducts(products, sortOrder);

  DOM.sectionItens.innerHTML = '';

  if (sortedProducts.length === 0) {
    clearProductList();
  } else {
    sortedProducts.forEach((element) => {
      DOM.sectionItens.appendChild(createProductItemElement(element));
    });
  }

  checkProductList();
  toggleLoading(false);
};

DOM.sortOrderSelect.addEventListener('change', () => {
  updateProductList(DOM.selectCategories.value);
});

DOM.formPesquisa.addEventListener('submit', (event) => {
  event.preventDefault();
  updateProductList(null, DOM.formPesquisa.querySelector('#pesquisaInput').value);
});

DOM.selectCategories.addEventListener('change', (event) => {
  updateProductList(event.target.value);
});

const showCategories = async () => {
  const categories = await fetchCategories();
  const categoriesList = DOM.selectCategories;

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.text = 'Selecione uma categoria';
  categoriesList.appendChild(defaultOption);

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.text = category.name;
    categoriesList.appendChild(option);
  });
};

const addToCart = async (event) => {
  const productId = event.target.parentElement.querySelector('span.item__sku').innerText;
  const cartItems = DOM.cartLista;
  const addButton = event.target;

  // Adiciona o efeito de loading
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  addButton.appendChild(loadingDiv);

  // Checa se o item já está no carrinho
  const existingCartItem = Array.from(cartItems.children).find(
    (item) => item.getAttribute('data-sku') === productId
  );

  if (existingCartItem) {
    // Se o item já está no carrinho, atualiza a quantidade
    const quantitySpan = existingCartItem.querySelector('.cart__item__quantity');
    const quantity = parseInt(quantitySpan.innerText, 10);
    quantitySpan.innerText = quantity + 1;
  } else {
    // Se o item ainda não está no carrinho, adiciona uma nova li
    try {
      const item = await fetchItem(productId);
      cartItems.appendChild(createCartItemElement(item));
      saveCartItems(cartItems);
    } catch (error) {
      console.error(error);
    }
  }

  // Remove o efeito de loading
  addButton.removeChild(loadingDiv);

  updateTotalPrice();
};

DOM.sectionItens.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    addToCart(event);
  }
});

DOM.btnVazio.addEventListener('click', () => {
  DOM.cartLista.innerHTML = '';
  saveCartItems(DOM.cartLista);
  updateTotalPrice();
});

const updateTotalPrice = () => {
  const cartItems = DOM.cartLista;
  const totalPriceDiv = DOM.precoTotalDiv;

  const totalPrice = Array.from(cartItems.children).reduce((acc, item) => {
    const price = parseFloat(item.getAttribute('data-price'));
    const quantity = parseInt(item.querySelector('.cart__item__quantity').innerText, 10);
    return acc + price * quantity;
  }, 0);

  totalPriceDiv.innerText = `${totalPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`;

};

function loadCartItems() {
  const cartItems = getSavedCartItems();

  if (cartItems && cartItems.length > 0) {
    cartItems.forEach((item) => {
      DOM.cartLista.appendChild(createCartItemElement(item));
    });
    updateTotalPrice();
  }
};

function createProductItemElement({ id: sku, title: name, price, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const button = document.createElement('button');
  button.className = 'item__add';
  button.innerText = 'Adicionar ao carrinho!';

  const span = document.createElement('span');
  span.className = 'item__sku';
  span.innerText = sku;

  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = image;

  const p1 = document.createElement('p');
  p1.className = 'item__title';
  p1.innerText = name;

  const p2 = document.createElement('p');
  p2.className = 'item__price';
  p2.innerText = `R$ ${price.toFixed(2)}`;

  section.appendChild(button);
  section.appendChild(span);
  section.appendChild(img);
  section.appendChild(p1);
  section.appendChild(p2);

  return section;
};

function createCartItemElement({ id: sku, title: name, price, thumbnail: image }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.setAttribute('data-sku', sku);
  li.setAttribute('data-price', price.toFixed(2));

  const span = document.createElement('span');
  span.className = 'cart__item__price';
  span.innerText = `R$ ${price.toFixed(2)}`;

  const img = document.createElement('img');
  img.className = 'cart__item__image';
  img.src = image;

  const p = document.createElement('p');
  p.className = 'cart__item__title';
  p.innerText = name;

  // Adicione controles de quantidade
  const quantityControls = document.createElement('div');
  quantityControls.className = 'quantity-controls';

  const decrementBtn = document.createElement('button');
  decrementBtn.innerHTML = '-';
  decrementBtn.setAttribute('data-action', 'decrement');

  const quantitySpan = document.createElement('span');
  quantitySpan.innerText = '1';
  quantitySpan.className = 'cart__item__quantity';

  const incrementBtn = document.createElement('button');
  incrementBtn.innerHTML = '+';
  incrementBtn.setAttribute('data-action', 'increment');

  quantityControls.appendChild(decrementBtn);
  quantityControls.appendChild(quantitySpan);
  quantityControls.appendChild(incrementBtn);

  // Crie o botão de exclusão e adicione a imagem da lixeira
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'cart__item__delete';
  deleteBtn.className = 'cart__item__delete';
  deleteBtn.innerHTML = '<i class="material-icons">delete</i>';

  li.appendChild(img);
  li.appendChild(p);
  li.appendChild(quantityControls); // Adicione os controles de quantidade
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
};

DOM.cartLista.addEventListener('click', (event) => {
  if (event.target.classList.contains('cart__item__delete') || event.target.parentElement.classList.contains('cart__item__delete')) {
    const cartItem = event.target.closest('.cart__item');
    cartItem.remove();
    saveCartItems(DOM.cartLista);
    updateTotalPrice();
  }
});

const updateCartItemQuantity = (element, action) => {
  const quantitySpan = element.querySelector('.cart__item__quantity');
  let quantity = parseInt(quantitySpan.innerText, 10);

  if (action === 'increment') {
    quantity += 1;
  } else if (action === 'decrement' && quantity > 1) {
    quantity -= 1;
  }

  quantitySpan.innerText = quantity;

  const price = parseFloat(element.getAttribute('data-price'));
  const updatedPrice = price * quantity;
  element.querySelector('.cart__item__price').innerText = `R$ ${updatedPrice.toFixed(2)}`;
};

DOM.cartLista.addEventListener('click', (event) => {
  const action = event.target.getAttribute('data-action');
  const cartItem = event.target.closest('.cart__item');

  if (action === 'increment' || action === 'decrement') {
    updateCartItemQuantity(cartItem, action);
    saveCartItems(DOM.cartLista);
    updateTotalPrice();
  }
});

window.onload = () => {
  loadCartItems();
  showCategories();
  updateProductList();
};    
