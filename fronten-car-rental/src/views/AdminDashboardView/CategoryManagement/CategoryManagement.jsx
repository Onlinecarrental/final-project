import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import axios from 'axios';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
      const response = await axios.get(`${API_BASE_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setLoading(true);
      const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
      const response = await axios.post(`${API_BASE_URL}/categories`, {
        name: newCategory.trim()
      });

      if (response.data.success) {
        setCategories([...categories, response.data.data]);
        setNewCategory('');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert(error.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (id) => {
    if (!editValue.trim()) return;

    try {
      setLoading(true);
      const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
      const response = await axios.put(`${API_BASE_URL}/categories/${id}`, {
        name: editValue.trim()
      });

      if (response.data.success) {
        setCategories(categories.map(cat =>
          cat._id === id ? { ...cat, name: editValue.trim() } : cat
        ));
        setEditingId(null);
        setEditValue('');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert(error.response?.data?.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      setLoading(true);
      const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
      const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);

      if (response.data.success) {
        setCategories(categories.filter(cat => cat._id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold mb-4">Category Management</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category Name"
              className="border p-2 rounded flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newCategory.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={20} />
              Add Category
            </button>
          </form>

          <div className="grid gap-4">
            {categories.map(category => (
              <div
                key={category._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                {editingId === category._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border p-2 rounded flex-1 mr-2"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium">{category.name}</span>
                )}

                <div className="flex items-center gap-2">
                  {editingId === category._id ? (
                    <>
                      <button
                        onClick={() => handleEditCategory(category._id)}
                        className="text-green-600 hover:text-green-700"
                        disabled={loading}
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditValue('');
                        }}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(category._id);
                          setEditValue(category.name);
                        }}
                        className="text-black hover:text-blue-700"
                        disabled={loading}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}