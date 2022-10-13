const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

 const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getId = ({ target }) => {
  const id = target.parentNode.firstChild.innerText;
  fetchItem(id).then((e) => {
    cartItems.appendChild(createCartItemElement(e));
  });
};

const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item_id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const addToCart = document.querySelectorAll('.item__add');
  addToCart.forEach((e) => e.addEventListener('click', getId));

  return section;
};

const getIdFromProductItem = (product) => product.querySelector('span.id').innerText;

const sectionItens = document.querySelector('.items');

window.onload = () => {
  fetchProducts('computador').then(({ results }) => {
    results.forEach((element) => {
      sectionItens.appendChild(createProductItemElement(element));
    });
  });
};
