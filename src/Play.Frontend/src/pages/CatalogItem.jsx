import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCatalogItemById, deleteCatalogItem } from "../api/catalogApi";

function CatalogItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCatalogItemById(id)
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      try {
        await deleteCatalogItem(id);
        navigate("/catalog"); // Redirect back to list after deletion
      } catch (err) {
        alert("Failed to delete item: " + err.message);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
      <p className="text-gray-500 mb-8">{error}</p>
      <Link to="/catalog" className="text-orange-600 font-bold hover:underline">
        Return to Catalog
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumbs / Back Navigation */}
        <nav className="mb-8">
          <Link to="/catalog" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-2">
            <span>&larr;</span> Back to Catalog
          </Link>
        </nav>

        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
                Catalog Item
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {item.name}
              </h1>
            </div>
            <div className="text-3xl font-mono font-bold text-gray-900 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
              ${item.price}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Description Column */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Description</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Metadata Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Item ID</h3>
                <p className="font-mono text-xs text-gray-500 break-all bg-gray-100 p-2 rounded">
                  {item.id}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Created At</h3>
                <p className="text-sm text-gray-700">
                  {new Date(item.createdDate).toLocaleDateString()} at {new Date(item.createdDate).toLocaleTimeString()}
                </p>
              </div>
              
              {/* Danger Zone */}
              <div className="pt-6 border-t border-gray-200">
                <button 
                  onClick={handleDelete}
                  className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Delete from Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogItem;