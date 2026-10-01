import { loadHeaderFooter, getParam, renderCartItemsCount, initSearch } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

document.addEventListener("DOMContentLoaded", async() => {
    await loadHeaderFooter();
    initSearch();
    renderCartItemsCount();
    if (search) {
      const input = document.querySelector("#search-input");
      if (input) input.value = search;
    }
});

const category = getParam("category");
const search = getParam("search");
const query = search ?? category;
const isSearch = search !== null;
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(query, dataSource, element, isSearch);

listing.init(search ? `Search results for: ${search}` : null);