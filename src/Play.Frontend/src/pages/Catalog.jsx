import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Assuming these exist in your catalogApi.js based on the OpenAPI spec
import { 
  getCatalogItems, 
  createCatalogItem, 
  updateCatalogItem, 
  deleteCatalogItem 
} from "../api/catalogApi";

function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State for Create/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: 0 });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getCatalogItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateCatalogItem(editingItem.id, formData);
      } else {
        await createCatalogItem(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: "", description: "", price: 0 });
      loadItems(); // Refresh list
    } catch (err) {
      alert("Failed to save item: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteCatalogItem(id);
        loadItems();
      } catch (err) {
        alert("Failed to delete: " + err.message);
      }
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, price: item.price });
    setShowModal(true);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Catalog</h1>
            <p className="text-gray-500 mt-2">Manage your virtual economy assets</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors self-center">
              &larr; Dashboard
            </Link>
            <button 
              onClick={() => { setEditingItem(null); setFormData({name:"", description:"", price:0}); setShowModal(true); }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-orange-200"
            >
              + Create Item
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group border border-gray-200 rounded-2xl p-6 bg-white hover:border-orange-300 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="text-orange-600 font-mono font-bold">${item.price}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <Link to={`/catalog/${item.id}`} className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors mr-auto">
                  Details
                </Link>
                <button 
                  onClick={() => openEditModal(item)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit Item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Edit Item' : 'Create New Item'}</h2>
              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                  <input 
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none h-32"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;