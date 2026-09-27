export async function convertToJson(response) {
  const jsonResponse = await response.json();
  if (res.ok) {
    return jsonResponse;
  } throw {
    name: "serviceError",
    message: jsonResponse,
  };
}

export default class ExternalServices {
  async checkout(payload) {
    return fetch(`${baseURL}checkout/`, {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(payload),}).then(convertToJson);
  }
}
