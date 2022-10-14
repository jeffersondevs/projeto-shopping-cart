const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const itemsCar = document.querySelector('.cart__items');
const btnVazio = document.querySelector('.empty-cart');
const cartLista = document.querySelector('.cart__items');

const atualizaLocal = () => {
  localStorage.clear();
  saveCartItems(cartLista.innerHTML);
};

const recuperaLocal = () => {
  cartLista.innerHTML = getSavedCartItems();
};

btnVazio.addEventListener('click', () => {
  cartLista.innerHTML = null;
  atualizaLocal();
});

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const cartItemClick = ({ target }) => {
  target.remove();
  atualizaLocal();
};

 const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
  /* li.addEventListener('click', cartItemClickListener); */
  li.addEventListener('click', cartItemClick);
  return li;
};

const pegaId = ({ target }) => {
  const id = target.parentNode.firstChild.innerText;
  fetchItem(id).then((e) => {
    itemsCar.appendChild(createCartItemElement(e));
    atualizaLocal();
  });
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
  adicionarNoCar.forEach((element) => {
    element.addEventListener('click', cartItemClick);
  });
};
const getIdFromProductItem = (product) => product.querySelector('span.id').innerText;

const sectionItens = document.querySelector('.items');

window.onload = () => {
  fetchProducts('computador').then(({ results }) => {
    results.forEach((element) => {
      sectionItens.appendChild(createProductItemElement(element));
    });
  });
  /* recuperaLocal(); */
  adicionaListeners();
};
