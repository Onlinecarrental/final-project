import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Star, Edit, Save, RotateCcw } from 'lucide-react';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    rating: 5,
    text: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
      const response = await axios.get(`${API_BASE_URL}/reviews/all`);
      setReviews(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditForm({
      name: review.name,
      rating: review.rating,
      text: review.text
    });
  };

  const handleUpdate = async (id) => {
    try {
      const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
      const response = await axios.patch(
        `${API_BASE_URL}/reviews/${id}`,
        editForm
      );

      if (response.data.success) {
        setReviews(reviews.map(review =>
          review._id === id ? { ...review, ...editForm } : review
        ));
        setEditingId(null);
        alert('Review updated successfully!');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const response = await axios.delete(`${API_BASE_URL}/reviews/${id}`);

        if (response.data.success) {
          setReviews(reviews.filter(review => review._id !== id));
          alert('Review deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Review Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === review._id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    <div className="flex items-center">
                      <img
                        src={review.image ? review.image : "/images/default-avatar.jpg"}
                        alt={review.name}
                        className="h-10 w-10 rounded-full"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.jpg';
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{review.name}</div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === review._id ? (
                    <select
                      value={editForm.rating}
                      onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                      className="w-20 p-1 border rounded"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === review._id ? (
                    <textarea
                      value={editForm.text}
                      onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                      className="w-full p-1 border rounded"
                      rows="2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 line-clamp-2">{review.text}</p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {editingId === review._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(review._id)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="Save Changes"
                        >
                          <Save size={18} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          title="Cancel"
                        >
                          <RotateCcw size={18} />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Edit Review"
                        >
                          <Edit size={18} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="Delete Review"
                        >
                          <Trash2 size={18} />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}