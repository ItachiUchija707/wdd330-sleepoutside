// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// getParam function
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}


export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElemnt = document.querySelector("#main-header");
  const footerElemnt = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElemnt);
  renderWithTemplate(footerTemplate, footerElemnt);
}

import ProductData from "./ProductData.mjs";

let searchKeyCaptureInstalled = false;
let catalogPromise = null;

export function getSharedCatalog() {
  if (!catalogPromise) {
    catalogPromise = new ProductData().getCatalog().catch((err) => {
      catalogPromise = null;
      throw err;
    });
  }
  return catalogPromise;
}

export function preloadCatalog() {
  getSharedCatalog().catch(() => {});
}

function hideSuggestions(dropdown, input) {
  if (!dropdown) return;
  dropdown.hidden = true;
  dropdown.innerHTML = "";
  if (input) input.setAttribute("aria-expanded", "false");
}

function renderSuggestions(dropdown, input, results) {
  dropdown.innerHTML = results
    .map(
      (p) => `<li role="option" data-id="${p.Id}">
        <img src="${p.Images?.PrimaryMedium ?? ""}" alt="" />
        <span class="suggestion-text">${p.Brand?.Name ?? ""} ${p.Name ?? ""}</span>
        <span class="suggestion-price">$${p.FinalPrice ?? ""}</span>
      </li>`,
    )
    .join("");
  dropdown.hidden = false;
  input.setAttribute("aria-expanded", "true");
}

function bindSearchSuggestions(input) {
  const dropdown = document.querySelector("#search-suggestions");
  if (!input || !dropdown || input.dataset.suggestionsBound) return;
  input.dataset.suggestionsBound = "true";
  let debounce = null;
  let activeIndex = -1;

  const close = () => {
    activeIndex = -1;
    hideSuggestions(dropdown, input);
  };

  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const q = input.value.trim();
      if (q.length < 2) {
        close();
        return;
      }
      try {
        const catalog = await getSharedCatalog();
        const { rankSearchResults } = await import("./ProductList.mjs");
        const results = rankSearchResults(catalog, q).slice(0, 7);
        if (results.length === 0) {
          close();
          return;
        }
        activeIndex = -1;
        renderSuggestions(dropdown, input, results);
      } catch {
        close();
      }
    }, 150);
  });

  input.addEventListener("keydown", (e) => {
    const items = [...dropdown.querySelectorAll("li")];
    if (e.key === "Escape") {
      close();
      return;
    }
    if (dropdown.hidden || items.length === 0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex =
        e.key === "ArrowDown"
          ? (activeIndex + 1) % items.length
          : (activeIndex - 1 + items.length) % items.length;
      items.forEach((li, i) => li.classList.toggle("active", i === activeIndex));
    } else if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      window.location.href = `/product_pages/?product=${items[activeIndex].dataset.id}`;
    }
  });

  dropdown.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (li) window.location.href = `/product_pages/?product=${li.dataset.id}`;
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) close();
  });

  input.addEventListener("blur", () => {
    setTimeout(close, 150);
  });
}

function installSearchKeyCapture() {
  if (searchKeyCaptureInstalled) return;
  searchKeyCaptureInstalled = true;
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const t = e.target;
    if (
      t instanceof HTMLElement &&
      (t.matches("input, textarea, select") || t.isContentEditable)
    )
      return;
    const input = document.querySelector("#search-input");
    if (!input || document.activeElement === input) return;
    e.preventDefault();
    input.focus();
    input.value = `${input.value || ""}${e.key}`;
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

export function initSearch() {
  installSearchKeyCapture();
  preloadCatalog();
  const form = document.querySelector("#search-form");
  if (!form) return;
  const input = document.querySelector("#search-input");
  bindSearchSuggestions(input);
  if (form.dataset.searchBound) return;
  form.dataset.searchBound = "true";
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.querySelector("#search-input").value.trim();
    if (!q) return;
    window.location.href = `/product_listing/index.html?search=${encodeURIComponent(q)}`;
  });
}

export function renderCartItemsCount() {
  const cartCantItems = getLocalStorage("so-cart") || [];
  const cartClassElement = document.querySelector("#cart-cant-items");

  if (cartCantItems.length > 0) {
    if (cartClassElement.classList.contains("none")) {
      cartClassElement.classList.replace("none","cart-cant-items");
      cartClassElement.textContent = cartCantItems.length;
    }
    else
      cartClassElement.textContent = cartCantItems.length;
  }
    
  else {
    cartClassElement.classList.replace("cart-cant-items", "none");
    cartClassElement.textContent = "";
  }  
    
}

