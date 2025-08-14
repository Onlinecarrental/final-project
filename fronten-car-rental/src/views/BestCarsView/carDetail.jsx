import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function CarDetailCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching car details for ID:', id);
        const response = await axios.get(`https://backend-car-rental-production.up.railway.app/api/cars/${id}`);
        
        // Log the full response structure
        console.log('Full response:', {
          success: response.data.success,
          data: response.data.data
        });

        // Check if we have both success and data
        if (!response.data.success || !response.data.data) {
          throw new Error('Invalid response format');
        }

        // Set the car data from the data property
        setCar(response.data.data);
        
      } catch (error) {
        console.error('Failed to fetch car:', error);
        if (error.response?.status === 404) {
          setError('Car not found - It may have been removed');
        } else if (error.message === 'Invalid response format') {
          setError('Server returned invalid data format');
        } else {
          setError('Could not load car details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1250px] mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center text-red-700 mb-4">
          <h2 className="text-xl font-semibold">{error}</h2>
        </div>
        <button
          onClick={() => navigate('/home/best-cars')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Back to Cars
        </button>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-[1250px] mx-auto my-8 p-4">
        <h2>No car data available</h2>
        <button
          onClick={() => navigate('/home/best-cars')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Back to Cars
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] mx-auto my-8 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section */}
        <div>
          <img
            src={car.coverImage || "/default-car.jpg"}
            alt={car.name}
            className="w-full h-[400px] object-cover rounded-lg"
          />

          <div className="mt-4">
            <Swiper spaceBetween={10} slidesPerView={4}>
              {[car.image1, car.image2, car.image3, car.image4]
                .filter(Boolean)
                .map((image, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={image || "/default-car.jpg"}
                      alt={`View ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer"
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{car.name}</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div>Brand: {car.brand}</div>
            <div>Model: {car.model}</div>
            <div>Year: {car.year}</div>
            <div>Color: {car.color}</div>
            <div>Seats: {car.seats}</div>
            <div>Transmission: {car.transmission}</div>
            <div>Fuel Type: {car.fuelType}</div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold">${car.dailyRate}/day</h2>
          </div>

          {car.features && (
            <div>
              <h3 className="text-xl font-bold mb-2">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(car.features)
                  .filter(([_, value]) => value)
                  .map(([feature]) => (
                    <div key={feature} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}