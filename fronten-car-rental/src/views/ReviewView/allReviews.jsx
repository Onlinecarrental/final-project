import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseCard from '../../components/card';
import { Plus, Star } from 'lucide-react';

const API_BASE_URL = 'https://backend-car-rental-production.up.railway.app/api';

export default function AllREviews({ searchTerm }) {
  const [showForm, setShowForm] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 9;

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/reviews`);
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

  // Filter reviews based on searchTerm
  const filteredReviews = testimonials.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

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

      {/* Review Cards */}
      <div className='max-w-[1220px] mx-auto gap-6'>
        {currentReviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews found.</p>
        ) : (
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
                      className="h-10 w-10 rounded-full"
                      onError={(e) => { e.target.src = '/images/default-avatar.jpg'; }}
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`bg-Blue text-white px-4 py-2 rounded-[10px] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1
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
              className={`bg-Blue text-white px-4 py-2 rounded-[10px] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
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
