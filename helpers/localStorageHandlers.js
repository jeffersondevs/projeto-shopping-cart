function getSavedCartItems() {
    const savedCartItems = localStorage.getItem('cartItems');
  
    // Verifica se há itens salvos no localStorage e retorna-os como um objeto.
    // Caso contrário, retorna um objeto vazio.
    if (savedCartItems) {
      return JSON.parse(savedCartItems);
    } else {
      return {};
    }
  }
  
  function saveCartItems(cartItemsDOM) {
    // Converte os elementos DOM do carrinho em objetos e, em seguida, em uma string JSON antes de salvá-los no localStorage.
    const cartItems = cartItemsToObject(cartItemsDOM);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
  

  function cartItemsToObject(cartItemsDOM) {
    return Array.from(cartItemsDOM.children).map((item) => {
      return {
        id: item.getAttribute('data-sku'),
        title: item.querySelector('.cart__item__title').innerText,
        price: parseFloat(item.getAttribute('data-price')),
        thumbnail: item.querySelector('.cart__item__image').src,
        quantity: parseInt(item.querySelector('.cart__item__quantity').innerText, 10)
      };
    });
  }
  

export { getSavedCartItems, saveCartItems }