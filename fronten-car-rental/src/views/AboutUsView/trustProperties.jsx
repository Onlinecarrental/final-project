import React, { useState, useEffect } from 'react';
import { Shield, Award, ThumbsUp, Clock, Users, Star, CheckCircle, Truck } from 'lucide-react';
import axios from 'axios';

// Helper function to get image URL
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `/.netlify/functions/api${path}`;
};

// Define trust icons
const trustIcons = {
  'shield': <Shield className="w-12 h-12 text-blue-600" />,
  'award': <Award className="w-12 h-12 text-yellow-500" />,
  'thumbs-up': <ThumbsUp className="w-12 h-12 text-green-500" />,
  'star': <Star className="w-12 h-12 text-yellow-400" />,
  'check': <CheckCircle className="w-12 h-12 text-green-500" />,
  'truck': <Truck className="w-12 h-12 text-blue-500" />,
  'clock': <Clock className="w-12 h-12 text-purple-500" />,
  'users': <Users className="w-12 h-12 text-red-500" />
};

export default function TrustProperties() {
  const [trustData, setTrustData] = useState({
    title: "Trusted & Quality Service",
    description: "We are a company that provides the best car rental services in the world. We have been in business for over 10 years and have served more than 1 million customers.",
    items: [
      {
        icon: 'shield',
        title: 'Safe & Secure',
        description: "Your safety is our top priority with 24/7 support and secure transactions."
      },
      {
        icon: 'award',
        title: 'Award Winning',
        description: "Recognized as the best car rental service for 5 consecutive years."
      },
      {
        icon: 'truck',
        title: 'Wide Selection',
        description: "Choose from a wide range of well-maintained vehicles for every need."
      },
      {
        icon: 'check',
        title: 'Easy Booking',
        description: "Simple and quick booking process with instant confirmation."
      }
    ],
    image: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const response = await axios.get(`${API_BASE_URL}/about/trust`);

        if (response.data.success && response.data.data?.content) {
          const fetchedData = response.data.data.content;
          const itemsData = fetchedData.items || fetchedData.features || [];

          setTrustData(prev => ({
            ...prev,
            title: fetchedData.title || prev.title,
            description: fetchedData.description || prev.description,
            items: itemsData,
            image: fetchedData.image || prev.image
          }));
        }
      } catch (error) {
        console.error('Error fetching trust data:', error);
        setError('Failed to load trust data. Using default content.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrustData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="animate-pulse h-4 bg-gray-300 rounded w-2/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="animate-pulse h-12 w-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <div className="animate-pulse h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="animate-pulse h-3 bg-gray-200 rounded w-full mt-2"></div>
                  <div className="animate-pulse h-3 bg-gray-200 rounded w-5/6 mt-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 mt-8 justify-between items-start p-6 bg-white max-w-6xl mx-auto">
      <div className="w-full md:w-1/2 space-y-9 ">
        <div>
          <h2 className="text-4xl font-bold mb-2">{trustData.title}</h2>
          <p className="text-lg">{trustData.description}</p>
        </div>

        <div className="space-y-4">
          {trustData.items.map((item, index) => (
            <div className="flex gap-5 items-start" key={index}>
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                {trustIcons[item.icon]}
              </div>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-base">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <div className="rounded-lg overflow-hidden">
          <img
            src={getImageUrl(trustData.image)}
            alt="Luxury car"
            className="w-full h-auto mt-10 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "../src/assets/AUcar.svg";
            }}
          />
        </div>
      </div>
    </div>
  );
}