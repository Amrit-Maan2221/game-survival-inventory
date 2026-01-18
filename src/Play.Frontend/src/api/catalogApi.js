const BASE_URL = "https://play-catalog-service.azurewebsites.net";

/**
 * GET /CatalogItems
 * Fetches all items
 */
export async function getCatalogItems() {
  const response = await fetch(`${BASE_URL}/CatalogItems`);
  if (!response.ok) throw new Error("Failed to fetch catalog items");
  return response.json();
}

/**
 * GET /CatalogItems/{id}
 * Fetches a single item by UUID
 */
export async function getCatalogItemById(id) {
  const response = await fetch(`${BASE_URL}/CatalogItems/${id}`);
  if (!response.ok) throw new Error("Failed to fetch catalog item");
  return response.json();
}

/**
 * POST /CatalogItems
 * Creates a new item. Expects { name, description, price }
 */
export async function createCatalogItem(itemData) {
  const response = await fetch(`${BASE_URL}/CatalogItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) throw new Error("Failed to create catalog item");
  return response.json();
}

/**
 * PUT /CatalogItems/{id}
 * Updates an existing item. Expects { name, description, price }
 */
export async function updateCatalogItem(id, itemData) {
  const response = await fetch(`${BASE_URL}/CatalogItems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) throw new Error("Failed to update catalog item");
  // The API returns 200 OK but may not return a body for PUT
  return response.status === 204 ? null : response.json().catch(() => null);
}

/**
 * DELETE /CatalogItems/{id}
 * Removes an item from the catalog
 */
export async function deleteCatalogItem(id) {
  const response = await fetch(`${BASE_URL}/CatalogItems/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete catalog item");
  return true;
}