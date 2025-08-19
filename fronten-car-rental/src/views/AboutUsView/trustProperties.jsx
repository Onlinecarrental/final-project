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
  'shield': <Shield className="w-8 h-8 text-black" />,
  'award': <Award className="w-8 h-8 text-black" />,
  'thumbs-up': <ThumbsUp className="w-8 h-8 text-black" />,
  'star': <Star className="w-8 h-8 text-black" />,
  'check': <CheckCircle className="w-8 h-8 text-black" />,
  'truck': <Truck className="w-8 h-8 text-black" />,
  'clock': <Clock className="w-8 h-8 text-black" />,
  'users': <Users className="w-8 h-8 text-black" />
};

export default function TrustProperties() {
  const [trustData, setTrustData] = useState({
    header: {
      title: "Why Trust Us",
      description: "Our commitment to excellence",
      subtitle: ""
    },
    items: []
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
          const { header, items } = response.data.data.content;
          setTrustData({
            header: {
              title: header?.title || 'Why Trust Us',
              description: header?.description || 'Our commitment to excellence',
              subtitle: header?.subtitle || ''
            },
            items: items || [],
            image: response.data.data.content.image || ''
          });
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
      <div className="w-full md:w-1/2 space-y-9">
        <div>
          <h2 className="text-4xl font-bold mb-2">{trustData?.header?.title}</h2>
          <p className="text-lg">{trustData?.header?.description}</p>

        </div>

        <div className="space-y-4">
          {trustData.items.map((item, index) => (
            <div className="flex gap-5 items-center" key={index}>
              <div className="flex items-center justify-center w-12 h-12 bg-gray rounded-[10px]">
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