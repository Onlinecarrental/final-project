import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/button';
import carimage from '../../assets/car 2 1.svg';

const getImageUrl = (path) => {
  if (!path) return carimage;
  if (path.startsWith('http')) return path;
  return `https://backendonlinecar.netlify.app/.netlify/functions/express-server/${path.replace(/^\/+/, '')}`;
};

export default function HeroSectionHome() {
  const [heroData, setHeroData] = useState({
    title: '',
    description: '',
    image: carimage
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('https://backendonlinecar.netlify.app/.netlify/functions/express-server/api/homepage/hero');

        if (response.data.success && response.data.data) {
          const content = response.data.data.content || {};
          const imageUrl = getImageUrl(content.image);

          // Preload the image
          const img = new Image();
          img.src = imageUrl;

          img.onload = () => {
            setHeroData({
              title: content.title || '',
              description: content.description || '',
              image: imageUrl
            });
            setLoading(false);
          };

          img.onerror = () => {
            console.error('Failed to load image:', imageUrl);
            setHeroData(prev => ({
              ...prev,
              image: carimage
            }));
            setLoading(false);
          };
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setError('Failed to load hero section data');
        setHeroData(prev => ({ ...prev, image: carimage }));
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <div className="relative bg-gray w-full h-[100%] flex">
      <div className="max-w-[1280px] mx-auto px-6 w-full pt-8 md:pt-36 flex flex-col md:flex-row items-start justify-between">
        {/* Left content */}
        <div className="w-full md:w-1/2">
          {loading ? (
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 animate-fadeIn">
                {heroData.title || 'Welcome to Car Rental'}
              </h1>
              <p className="text-lg md:text-xl text-black mb-8 animate-fadeIn">
                {heroData.description || 'Find your perfect ride for any journey'}
              </p>
              <Button
                height="43px"
                width="auto"
                boxShadow={false}
                title="Book Now"
                to="/login"
                className="animate-fadeIn"
              />
            </>
          )}
        </div>

        {/* Right content - Image */}
        <div className="w-full md:w-1/2 mt-8 flex justify-end">
          {loading ? (
            <div className="animate-pulse bg-gray-200 w-full h-[300px] rounded"></div>
          ) : (
            <img
              src={heroData.image}
              alt="Featured Car"
              className="object-contain max-w-full h-auto animate-fadeIn"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = carimage;
              }}
            />
          )}
        </div>
      </div>

      {error && (
        <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}