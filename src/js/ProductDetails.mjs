import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }
  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    const addToCartButton = document.querySelector("#addToCart");
    addToCartButton.addEventListener("click", this.addProductToCart.bind(this));
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }
  renderProductDetails() {
    const product = this.product;

    const productDetail = document.querySelector(".product-detail");

    productDetail.innerHTML = `
      <h3>${product.Brand.Name}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>

      <img
        class="divider"
        src="${product.Image}"
        alt="${product.Name}"
        id="productImage"
      />

      <p class="product-card__price">$${product.FinalPrice}</p>

      <p class="product__color">${product.Colors[0].ColorName}</p>

      <p class="product__description">
        ${product.DescriptionHtmlSimple}
      </p>

      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    `;
  }
}