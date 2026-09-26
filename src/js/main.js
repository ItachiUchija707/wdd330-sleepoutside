import { loadHeaderFooter, renderCartItemsCount, initSearch } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async() => {
    await loadHeaderFooter();
    initSearch();
    renderCartItemsCount();
});
