import { getParam, loadHeaderFooter, renderCartItemsCount, initSearch } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

document.addEventListener("DOMContentLoaded", async() => {
    await loadHeaderFooter();
    initSearch();
    renderCartItemsCount();
});

const dataSource = new ExternalServices("tents");
const productId = getParam("product");
const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();
