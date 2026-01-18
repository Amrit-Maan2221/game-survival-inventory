import { useState, useEffect } from "react";
import { getInventoryItems, grantItems } from "../api/inventoryApi";
import { getCatalogItems } from "../api/catalogApi";

// Helper to generate a random UUID for demo purposes
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function Inventory() {
  // Initialize with a random UUID to represent "Current Session User"
  const [userId] = useState(() => generateUUID());
  const [items, setItems] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]); // To help user select an item
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grant Modal State
  const [showModal, setShowModal] = useState(false);
  const [grantData, setGrantData] = useState({ catalogItemId: "", quantity: 1 });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load both the user's inventory and the available catalog items (for the grant dropdown)
      const [inventoryData, catalogData] = await Promise.all([
        getInventoryItems(userId),
        getCatalogItems()
      ]);
      setItems(inventoryData);
      setCatalogItems(catalogData);
    } catch (err) {
      setError("Failed to sync with inventory service.");
    } finally {
      setLoading(false);
    }
  };

  const handleGrant = async (e) => {
    e.preventDefault();
    if (!grantData.catalogItemId) return alert("Please select an item");

    try {
      await grantItems({ ...grantData, userId });
      setShowModal(false);
      setGrantData({ catalogItemId: "", quantity: 1 });
      loadData(); // Refresh list
    } catch (err) {
      alert("Grant failed: " + err.message);
    }
  };

  if (loading && items.length === 0) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* User Profile Header */}
        <div className="bg-gray-900 rounded-3xl p-8 mb-12 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-orange-500 font-bold text-sm mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              ACTIVE SESSION
            </div>
            <h1 className="text-3xl font-black">Player Inventory</h1>
            <p className="text-gray-400 font-mono text-xs mt-2 break-all bg-gray-800/50 p-2 rounded">
              User ID: {userId} (Randomly Assigned)
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all whitespace-nowrap"
          >
            + Grant New Item
          </button>
        </div>

        {/* Inventory List */}
        {items.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-400">Inventory is empty</h3>
            <p className="text-gray-500 mt-2">Use the "Grant New Item" button to add items to this player.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div key={item.catalogItemId} className="flex items-center justify-between p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{item.description}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity</div>
                    <div className="text-xl font-black text-orange-600">x{item.quantity}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acquired</div>
                    <div className="text-sm font-medium">{new Date(item.acquiredDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grant Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Grant Item</h2>
              <form onSubmit={handleGrant} className="space-y-5">
                
                {/* Disabled User ID field */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Target User ID</label>
                  <input 
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 font-mono text-xs text-gray-500"
                    value={userId}
                  />
                </div>

                {/* Catalog Item Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Select Catalog Item</label>
                  <select 
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={grantData.catalogItemId}
                    onChange={e => setGrantData({...grantData, catalogItemId: e.target.value})}
                  >
                    <option value="">-- Choose an Item --</option>
                    {catalogItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (${item.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Quantity</label>
                  <input 
                    type="number" min="1" required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    value={grantData.quantity}
                    onChange={e => setGrantData({...grantData, quantity: parseInt(e.target.value)})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200">Grant Items</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;