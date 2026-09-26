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

export function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stripHtml(html) {
  if (!html) return "";
  const withoutTags = html.replace(/<[^>]*>/g, " ");
  return withoutTags
    .replace(/&#39;|&apos;/g, "\u0027")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

export function getSearchableText(product) {
  const colors = (product.Colors ?? []).map((c) => c.ColorName).join(" ");
  return normalizeText(
    [
      product.Name ?? "",
      product.NameWithoutBrand ?? "",
      product.Brand?.Name ?? "",
      colors,
      stripHtml(product.DescriptionHtmlSimple ?? ""),
    ].join(" "),
  );
}

const IRREGULAR_PLURALS = {
  children: "child",
  people: "person",
  men: "man",
  women: "woman",
  teeth: "tooth",
  feet: "foot",
  mice: "mouse",
  geese: "goose",
  oxen: "ox",
  knives: "knife",
  wolves: "wolf",
  leaves: "leaf",
  lives: "life",
};

export function normalizeText(s) {
  return (s ?? "").toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
}

export function singularizeToken(token) {
  if (!token || token.length <= 3) return token;
  if (IRREGULAR_PLURALS[token]) return IRREGULAR_PLURALS[token];
  if (token.endsWith("ies")) return token.slice(0, -3) + "y";
  if (/(ches|shes|sses|xes|zes|oes)$/.test(token)) return token.slice(0, -2);
  if (token.endsWith("ves")) return token.slice(0, -3) + "f";
  if (token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

export function getQueryVariants(query) {
  const base = normalizeText(query);
  if (!base) return [];
  const sing = base
    .split(" ")
    .map(singularizeToken)
    .join(" ");
  const set = new Set([base, sing]);
  if (base === sing) set.add(`${base}s`);
  for (const [pl, sg] of Object.entries(IRREGULAR_PLURALS)) {
    if (sing === sg) set.add(pl);
    if (base === pl) set.add(sg);
  }
  return [...set].filter(Boolean);
}

export function rankSearchResults(list, query) {
  const variants = getQueryVariants(query);
  if (variants.length === 0) return [];
  const exactRe = new RegExp(`\\b(${variants.map(escapeRegExp).join("|")})\\b`, "i");
  const tierExact = [];
  const tierPartial = [];
  for (const product of list) {
    const text = getSearchableText(product);
    if (exactRe.test(text)) tierExact.push(product);
    else if (variants.some((v) => text.includes(v))) tierPartial.push(product);
  }
  return [...tierExact, ...tierPartial];
}

export default class ProductList {
  constructor(category, dataSource, listElement, isSearch = false) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.isSearch = isSearch;
  }

  async init(title = null) {
    let list;
    if (this.isSearch) {
      list = await this.dataSource.searchProducts(this.category);
      list = rankSearchResults(list, this.category);
    } else {
      list = await this.dataSource.getData(this.category);
    }

    this.renderList(list);
    document.querySelector(".title").textContent = title ?? this.category;

    if (list.length === 0 && this.isSearch) {
      this.listElement.innerHTML = `<li class="no-results">
        <p>No products found for "${this.category}".</p>
        <p>Try: <a href="/product_listing/index.html?category=tents">Tents</a>,
        <a href="/product_listing/index.html?category=backpacks">Backpacks</a>,
        <a href="/product_listing/index.html?category=sleeping-bags">Sleeping Bags</a>,
        <a href="/product_listing/index.html?category=hammocks">Hammocks</a></p>
      </li>`;
    }

  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}