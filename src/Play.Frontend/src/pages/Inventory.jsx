import { useEffect, useState } from "react";
import { getInventoryItems, grantItems } from "../api/inventoryApi";

// 🔒 Hardcoded user id (for now)
const USER_ID = "11111111-1111-1111-1111-111111111111";

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      const data = await getInventoryItems(USER_ID);
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGrantItem() {
    try {
      await grantItems({
        userId: USER_ID,
        catalogItemId: "22222222-2222-2222-2222-222222222222",
        quantity: 1,
      });

      await loadInventory();
    } catch (err) {
      alert("Failed to grant item");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-orange-600 font-semibold">
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-orange-600">
          Inventory
        </h1>

        <button
          onClick={handleGrantItem}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          + Grant Test Item
        </button>
      </div>

      {/* Inventory Grid */}
      {items.length === 0 ? (
        <div className="text-gray-500 text-center">
          No items in inventory
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.catalogItemId}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">
                  {item.name}
                </h2>
                <span className="text-orange-600 font-bold">
                  x{item.quantity}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {item.description}
              </p>

              <div className="text-xs text-gray-400">
                Acquired on{" "}
                <span className="font-medium">
                  {new Date(item.acquiredDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inventory;
