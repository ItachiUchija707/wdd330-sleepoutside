import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter, renderCartItemsCount } from "./utils.mjs";


const order = new CheckoutProcess("so-cart", ".order-summary");
order.init();

document.addEventListener("DOMContentLoaded", async() => {
    order.calculateOrderTotal();
    await loadHeaderFooter();
    renderCartItemsCount();
});


// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));


// listening for click on the button
document.querySelector("#checkout-btn").addEventListener("click", (e) => {
  e.preventDefault();

  order.checkout();
});