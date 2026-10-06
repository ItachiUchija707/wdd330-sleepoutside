const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("json")) {
      throw new Error(
        `Expected JSON but got "${contentType}". Check VITE_SERVER_URL and request URL: ${res.url}`,
      );
    }
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async getCatalog() {
    if (this._catalog) return this._catalog;
    const cats = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const chunks = await Promise.all(
      cats.map(async (c) => ({ c, r: await this.getData(c) })),
    );
    const seen = new Map();
    for (const { c, r } of chunks) {
      for (const p of r ?? []) {
        if (!seen.has(p.Id)) seen.set(p.Id, { ...p, __sourceCat: c });
      }
    }
    this._catalog = [...seen.values()];
    return this._catalog;
  }
  async searchProducts(query) {
    const response = await fetch(`${baseURL}products/search/${query}`);
    const data = await convertToJson(response);
    if (data.Result?.length) return data.Result;
    // Fallback only on empty (not on error): reuse preloaded catalog.
    return this.getCatalog();
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}