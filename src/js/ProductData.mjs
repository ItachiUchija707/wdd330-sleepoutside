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
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    
    return data.Result;
  }
}