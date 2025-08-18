import React, { useState, useEffect } from "react";
import axios from 'axios';
import HeadingTitle from "../../components/heading";
import BaseCard from "../../components/card";
import defaultJeep from "../../assets/image 35.svg"; // Rename to defaultJeep for clarity

// Add stepIcons object for SVG paths
const stepIcons = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  car: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z",
  key: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  drive: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
};

// Default data
const defaultData = {
  header: {
    title: "How It Works",
    description: "Renting a car has never been easier with our simple steps"
  },
  steps: [
    {
      title: "Search Car",
      description: "Search for the perfect car that fits your needs",
      iconType: "search"
    },
    {
      title: "Select Car",
      description: "Choose from our wide range of vehicles",
      iconType: "car"
    },
    {
      title: "Book Car",
      description: "Complete the booking process easily",
      iconType: "key"
    },
    {
      title: "Drive Away",
      description: "Pick up your car and start your journey",
      iconType: "drive"
    }
  ],
  image: defaultJeep,
  imagePath: null // Add this for storing server image path
};

// Get image URL - prioritize Cloudinary URLs, fallback to default
const getImageUrl = (path) => {
  if (!path) return defaultJeep;
  // Return the path as is if it's already a full URL (Cloudinary or other)
  if (path.startsWith('http')) return path;
  // For any other cases, return the default image
  return defaultJeep;
};

export default function HowItWork() {
  const [howItWorksData, setHowItWorksData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHowItWorks = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const response = await axios.get(`${API_BASE_URL}/homepage/howItWorks`);

        if (response.data.success && response.data.data?.content) {
          const content = response.data.data.content;
          
          setHowItWorksData({
            header: {
              title: content.header?.title || defaultData.header.title,
              description: content.header?.description || defaultData.header.description
            },
            steps: Array.isArray(content.steps) && content.steps.length > 0
              ? content.steps
              : defaultData.steps,
            image: content.image ? getImageUrl(content.image) : defaultJeep,
            imagePath: content.image || null // Store the original path
          });

          console.log('Image path from server:', content.image);
          console.log('Constructed image URL:', getImageUrl(content.image));
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchHowItWorks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1250px] mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="md:w-1/2 h-[500px] bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] mx-auto p-6">
      <HeadingTitle
        title={howItWorksData.header.title}
        paragraph={howItWorksData.header.description}
      />

      {error && (
        <div className="text-red-600 mb-8 bg-red-50 p-4 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col mt-12 w-full lg:w-[1120px] h-auto lg:h-[550px] md:flex-row">
        <div className="md:w-1/2 relative lg:bottom-[24px] lg:left-[140px] z-[1] flex flex-col space-y-4">
          {howItWorksData.steps.map((step, index) => (
            <BaseCard
              key={index}
              width="w-full lg:w-[550px]"
              height="h-auto"
              boxShadow={false}
              className="flex items-center p-4 border border-gray gap-4"
            >
              <BaseCard
                bgColor="bg-gray"
                boxShadow={false}
                width="w-[56px]"
                height="h-[76px]"
                className="flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stepIcons[step.iconType] || stepIcons.search}
                  />
                </svg>
              </BaseCard>
              <div>
                <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </BaseCard>
          ))}
        </div>

        <BaseCard
          width="w-full lg:w-[620px]"
          height="h-[500px]"
          boxShadow={false}
          bgColor="bg-gray"
          className="flex justify-end items-center mt-8 md:mt-0"
        >
          <div className="flex justify-end my-auto">
            <img 
              src={howItWorksData.image} 
              alt="How It Works Vehicle" 
              className="w-full max-w-[400px] h-auto object-contain"
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.onerror = null;
                e.target.src = defaultJeep;
              }}
            />
          </div>
        </BaseCard>
      </div>
    </div>
  );
}