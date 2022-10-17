const saveCartItems = (items) => {
  // seu código aqui
 return localStorage.setItem('cartItems', items);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
