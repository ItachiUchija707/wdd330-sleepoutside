import { loadHeaderFooter, renderCartItemsCount } from "./utils.mjs";

document.addEventListener('DOMContentLoaded', async() => {
    await loadHeaderFooter();
    renderCartItemsCount();
});
