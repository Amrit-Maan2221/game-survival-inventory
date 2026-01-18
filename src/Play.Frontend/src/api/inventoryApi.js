const BASE_URL = "https://play-inventory-service.azurewebsites.net";

export async function getInventoryItems(userId) {
  const response = await fetch(`${BASE_URL}/InventoryItems?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch inventory");
  return response.json();
}

export async function grantItems(grantData) {
  const response = await fetch(`${BASE_URL}/InventoryItems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(grantData),
  });
  if (!response.ok) throw new Error("Failed to grant items");
  return response.status === 200 ? null : response.json();
}