const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async searchProducts(query) {
    const response = await fetch(`${baseURL}products/search/${query}`);
    const data = await convertToJson(response);
    if (data.Result?.length) return data.Result;
    // Fallback only on empty (not on error): aggregate the 4 categories.
    const cats = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const all = (await Promise.all(cats.map((c) => this.getData(c)))).flat();
    const seen = new Set();
    return all.filter((p) => !seen.has(p.Id) && seen.add(p.Id));
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    
    return data.Result;
  }
}