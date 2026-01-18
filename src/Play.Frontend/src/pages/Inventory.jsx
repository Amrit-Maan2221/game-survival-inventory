import React, { useEffect, useState } from 'react';
import { getInventoryItems, grantItems } from '../api/inventoryApi';
import { getCatalogItems } from '../api/catalogApi'; // Added this import

const HARDCODED_USER_ID = "7e3c6c6a-8c4f-4f4e-9c2b-6f9e5b7a1d42";

function Inventory() {
  const [items, setItems] = useState([]);
  const [catalog, setCatalog] = useState([]); // Store available catalog items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grant Form State
  const [selectedCatalogId, setSelectedCatalogId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isGranting, setIsGranting] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setLoading(true);
      // Fetch both Inventory and Catalog items simultaneously
      const [inventoryData, catalogData] = await Promise.all([
        getInventoryItems(HARDCODED_USER_ID),
        getCatalogItems()
      ]);
      setItems(inventoryData);
      setCatalog(catalogData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGrant = async (e) => {
    e.preventDefault();
    if (!selectedCatalogId) return;

    try {
      setIsGranting(true);
      await grantItems({
        userId: HARDCODED_USER_ID,
        catalogItemId: selectedCatalogId,
        quantity: parseInt(quantity),
      });
      
      // Reset form and refresh inventory list
      setSelectedCatalogId("");
      setQuantity(1);
      const updatedInventory = await getInventoryItems(HARDCODED_USER_ID);
      setItems(updatedInventory);
    } catch (err) {
      setError("Grant failed: " + err.message);
    } finally {
      setIsGranting(false);
    }
  };

  if (loading && items.length === 0) return (
    <div className="flex justify-center items-center h-screen text-orange-600">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 border-b-2 border-orange-600 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-orange-600 tracking-tight uppercase">Player Inventory</h1>
          <p className="text-gray-500 mt-1 font-mono text-xs italic">Active User: {HARDCODED_USER_ID}</p>
        </div>
        <button 
          onClick={initData}
          className="bg-white border-2 border-orange-600 text-orange-600 px-4 py-2 rounded-md font-bold hover:bg-orange-600 hover:text-white transition shadow-sm"
        >
          REFRESH ALL
        </button>
      </div>

      {/* Grant Item Form (Now with Catalog Fetching) */}
      <div className="max-w-6xl mx-auto mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide">Add Equipment to Player</h2>
        <form onSubmit={handleGrant} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Select Catalog Item</label>
            <select 
              required
              value={selectedCatalogId}
              onChange={(e) => setSelectedCatalogId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none bg-white"
            >
              <option value="">-- Choose from Catalog --</option>
              {catalog.map(catItem => (
                <option key={catItem.id} value={catItem.id}>
                  {catItem.name} (${catItem.price})
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Quantity</label>
            <input 
              required
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={isGranting || !selectedCatalogId}
            className="w-full md:w-auto bg-orange-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 disabled:bg-gray-300 transition shadow-md whitespace-nowrap"
          >
            {isGranting ? "GRANTING..." : "GRANT ITEM"}
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex justify-between">
          <span><strong>Error:</strong> {error}</span>
          <button onClick={() => setError(null)} className="font-bold">&times;</button>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.catalogItemId} className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:border-orange-300 transition-all">
              <div className="bg-orange-600 p-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg truncate">{item.name}</h3>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  x{item.quantity}
                </span>
              </div>
              <div className="p-5">
                <p className="text-gray-500 text-sm mb-6 h-10 overflow-hidden line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-widest">Acquired On</span>
                    <span className="text-sm text-gray-700 font-semibold">
                      {new Date(item.acquiredDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-widest">Catalog Ref</span>
                    <span className="text-[10px] font-mono text-gray-400">#{item.catalogItemId.substring(0, 8)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            <div className="text-orange-200 mb-4 flex justify-center">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <p className="text-gray-400 text-lg font-medium">Player inventory is empty.</p>
            <p className="text-gray-300 text-sm">Select an item above to populate the stash.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;