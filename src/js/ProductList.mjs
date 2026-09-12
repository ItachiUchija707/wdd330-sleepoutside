import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {

  // Discount task changes
  // This checks if the final price of product is less than the suggested price to detremine if it has a discount
  const hasDiscount = product.FinalPrice < product.SuggestedRetailPrice;
  // Then this calculates how much dollars are being saved
  const savings = hasDiscount ? (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2) : 0;
  // Here is checked if the item has a dicount and if it does a span element is created to display that information
  const discountSection = hasDiscount ? `<span class="discount-section">Save $${savings}</span>` : "";

  const displayPrice = hasDiscount ? `<p class="product-card__price">
  <span class="original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>
  $${product.FinalPrice.toFixed(2)}</p>`
    : `<p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>`;
  
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      ${discountSection}
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      ${displayPrice}
    </a>
  </li>`
}
/* <p class="product-card__price">$${product.ListPrice}</p> section removed from return element */

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // You passed in this information to make the class as reusable as possible.
    // Being able to define these things when you use the class will make it very flexible
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // the dataSource will return a Promise...so you can use await to resolve it.
    const list = await this.dataSource.getData();
    this.renderList(list);
    // next, render the list – ** future **
  }
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
