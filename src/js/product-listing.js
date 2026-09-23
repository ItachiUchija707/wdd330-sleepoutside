import { loadHeaderFooter, getParam, renderCartItemsCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

document.addEventListener('DOMContentLoaded', async() => {
    await loadHeaderFooter();
    renderCartItemsCount();
});

const category = getParam("category");
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

listing.init();