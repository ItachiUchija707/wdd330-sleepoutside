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
      <a href="/product_pages/?product=${product.Id}">
      ${discountSection}
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
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
    this.list = [];
  }
  async init() {
    this.list = await this.dataSource.getData(this.category);
    this.renderList(this.list);
    document.querySelector(".title").textContent = this.category;

    document
      .getElementById("sort-select")
      ?.addEventListener("change", (event) => {
        this.sortList(event.target.value);
      });
  }
  sortList(sortBy) {
    const sorted = [...this.list];

    if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => b.Name.localeCompare(a.Name));
    } else if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.FinalPrice - a.FinalPrice);
    }
    this.renderList(sorted);
  }
  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
