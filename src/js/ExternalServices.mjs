export async function convertToJson(response) {
  const jsonResponse = await response.json();
  if (res.ok) {
    return jsonResponse;
  } throw {
    name: "serviceError",
    message: jsonResponse,
  };
}
