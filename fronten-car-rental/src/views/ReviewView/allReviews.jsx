import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseCard from '../../components/card';
import { Plus, Star } from 'lucide-react';

export default function AllREviews() {
  const [showForm, setShowForm] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 9;

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://backend-car-rental-production.up.railway.app/api/reviews');
        if (response.data.success) {
          setTestimonials(response.data.data);
        }
      } catch (error) {
        setError('Failed to load reviews');
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const ReviewForm = ({ onClose }) => {
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      rating: 5,
      text: '',
      image: null,
      imagePreview: null
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form data
      if (!formData.name.trim() || !formData.text.trim()) {
        alert('Please fill all required fields');
        return;
      }

      try {
        setFormLoading(true);
        console.log('Submitting form data:', formData);

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name.trim());
        formDataToSend.append('rating', formData.rating);
        formDataToSend.append('text', formData.text.trim());
        
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }

        for (let pair of formDataToSend.entries()) {
          console.log('Form data entry:', pair[0], pair[1]);
        }

        const response = await axios.post(
          'https://backend-car-rental-production.up.railway.app/api/reviews',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            validateStatus: function (status) {
              return status < 500;
            }
          }
        );

        console.log('Server response:', response.data);

        if (response.data.success) {
          setTestimonials(prev => [response.data.data, ...prev]);
          alert('Review submitted successfully!');
          onClose();
        } else {
          throw new Error(response.data.message || 'Failed to submit review');
        }
      } catch (error) {
        console.error('Submission error:', error);
        console.error('Error response:', error.response?.data);
        alert(error.response?.data?.message || 'Failed to submit review. Please try again.');
      } finally {
        setFormLoading(false);
      }
    };

    const logFormData = () => {
      console.log('Current form data:', {
        name: formData.name,
        rating: formData.rating,
        text: formData.text,
        hasImage: !!formData.image
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <BaseCard width="w-full max-w-md" height="h-auto" className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold mb-6">Add Your Review</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  >
                    <svg 
                      className={`w-6 h-6 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Review</label>
              <textarea
                required
                rows="4"
                className="w-full p-2 border rounded"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData(prev => ({
                      ...prev,
                      image: file,
                      imagePreview: URL.createObjectURL(file)
                    }));
                  }
                }}
                className="w-full"
              />
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className={`w-full py-2 px-4 bg-Blue text-white rounded-md hover:bg-opacity-90 transition-colors ${
                formLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              {formLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </BaseCard>
      </div>
    );
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = testimonials.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(testimonials.length / reviewsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray pt-10 pb-12 w-full">
      <div className="max-w-[1220px] mx-auto mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-Blue text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          <Plus size={20} />
          <span>Add Review</span>
        </button>
      </div>

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}

      <div className='max-w-[1220px] mx-auto gap-6'>
        <div className="grid grid-cols-1 font-jakarta md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentReviews.map((review) => (
            <BaseCard height='h-auto' width='w-[380px]' key={review._id}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-yellow-400 fill-current" 
                    />
                  ))}
                </div>
                <span className="text-gray text-sm">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  }).toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{review.text}</p>

              <hr className="my-4 border-gray" />

              <div className="flex items-center">
                <div className="mr-3">
                  <img
                    src={review.image ? review.image : "/images/default-avatar.jpg"}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.jpg';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{review.name}</span>
                  <span className="text-xs text-gray">Customer</span>
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`bg-Blue text-white px-4 py-2 rounded-[10px] ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? 'bg-Blue text-white'
                    : 'bg-white text-black hover:bg-Blue hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`bg-Blue text-white px-4 py-2 rounded-[10px] ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}