import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");
const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();

function addProductToCart(product) {
  const storedCart = getLocalStorage("so-cart");
  const cart = Array.isArray(storedCart) ? storedCart : [storedCart];
  setLocalStorage("so-cart", [...cart, product]);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
