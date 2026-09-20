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
  

  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
      ${discountSection}
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
       ${displayPrice}
      </a>
    </li>
    `;
 
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    const selectedProducts = [list[0],list[1],list[3],list[5]];

    this.renderList(selectedProducts);
  }

  renderList(selectedProducts) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, selectedProducts);

  }

}