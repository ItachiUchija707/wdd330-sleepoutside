import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");



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

document.addEventListener("DOMContentLoaded", () => {
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const oldPrice = parseFloat(product.dataset.oldPrice);
        const newPrice = parseFloat(product.dataset.price);

        if (!oldPrice || !newPrice) return;

        const discount =
            Math.round(((oldPrice - newPrice) / oldPrice) * 100);

        const badge = document.createElement("span");
        badge.classList.add("discount-badge");
        badge.textContent = `-${discount}%`;

        product.appendChild(badge);
    });
});