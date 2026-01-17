const BASE_URL = "https://play-catalog-service.azurewebsites.net";

export async function getCatalogItems() {
  const response = await fetch(`${BASE_URL}/CatalogItems`);

  if (!response.ok) {
    throw new Error("Failed to fetch catalog items");
  }

  return response.json();
}

export async function getCatalogItemById(id) {
  const response = await fetch(`${BASE_URL}/CatalogItems/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch catalog item");
  }

  return response.json();
}
