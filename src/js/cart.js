import { setLocalStorage, getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // if there is no cart in local storage, it will return an empty array, so we can still render the cart page without errors.
  const htmlItems = cartItems.map((item, i) => cartItemTemplate(item, i)); // now the cartItemTemplate receives the item and the index of the item in the array, so we can use it to remove the item from the cart when the button is clicked.
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  }


function cartItemTemplate(item, i) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button data-index="${i}" class="remove-btn">X</button>
</li>`;

  return newItem;
}

function removeItemFromCart(index) {  // receive the parameter 'index' from the data-index attribute of the button
  const cart = getLocalStorage("so-cart");
  const updatedCart = cart.filter((_, i) => i !== parseInt(index));  // It only keeps in the array the Index NOT clicked. 
  setLocalStorage("so-cart", updatedCart);
  renderCartContents();
}

renderCartContents();
//this piece of code adds an event listener to the product list, and when a click event occurs, it checks if the clicked element
//  has the class 'remove-btn'. If it does, it calls the removeItemFromCart function with the index of the item to be removed, which is stored in the data-index attribute of the button.
document.querySelector(".product-list").addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-btn")) {
    removeItemFromCart(event.target.dataset.index);
  }
});
