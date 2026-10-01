import { getLocalStorage, setLocalStorage, renderCartItemsCount } from "./utils.mjs"

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
         // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        // the product details are needed before rendering the HTML
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
      let cart = getLocalStorage("so-cart") || [];
      if (!Array.isArray(cart)) cart = cart ? [cart] : [];
      const existing = cart.find((item) => item.Id === this.product.Id);
      if (existing) {
        existing.Quantity = (existing.Quantity || 1) + 1;
      } else {
        this.product.Quantity = 1;
        cart.push(this.product);
      }
      setLocalStorage("so-cart", cart);
      renderCartItemsCount();
    }

     renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector('h2').textContent = product.Brand.Name;
  document.querySelector('h3').textContent = product.NameWithoutBrand;

  const productImage = document.getElementById('productImage');
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  const suggested = Number(product.SuggestedRetailPrice);
  const finalPrice = Number(product.FinalPrice);
  const discount = suggested - finalPrice;

  const wrap = document.querySelector('.product-detail__image-wrap');
  wrap.querySelector(".discount-section")?.remove();
  if (discount > 0) {
    const badge = document.createElement('span');
    badge.className = 'discount-section';
    badge.textContent = `Save $${discount.toFixed(2)}`;
    wrap.prepend(badge);

    document.getElementById('productPrice').innerHTML =
      `<span class="original-price">$${suggested.toFixed(2)}</span>$${finalPrice.toFixed(2)}`;
  } else {
    document.getElementById('productPrice').innerHTML = `$${finalPrice.toFixed(2)}`;
  }
  
  document.getElementById('productColor').textContent = product.Colors[0].ColorName;
  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

  document.getElementById('addToCart').dataset.id = product.Id;
}
