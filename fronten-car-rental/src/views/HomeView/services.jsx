import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeadingTitle from '../../components/heading';

// Add serviceIcons object at the top
const serviceIcons = {
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  speed: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  support: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
};

export default function ServicesBenefits() {
  const [serviceData, setServiceData] = useState({
    header: {
      title: 'Our Services & Benefits',
      description: 'To make renting easy and hassle-free, we provide a variety of services and advantages'
    },
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('Fetching services...');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/homepage/services`);
        console.log('Services response:', response.data);

        if (response.data.success && response.data.data?.content) {
          const content = response.data.data.content;
          console.log('Content received:', content);

          setServiceData({
            header: {
              title: content.header?.title || serviceData.header.title,
              description: content.header?.description || serviceData.header.description
            },
            items: Array.isArray(content.items) ? content.items : []
          });
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchServices, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray py-8 px-4 w-full">
        <div className="max-w-[1250px] mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1120px] mx-auto">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-200 h-48 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray py-8 px-4 w-full">
      <div className="max-w-[1250px] mx-auto text-center">
        <HeadingTitle
          title={serviceData.header.title}
          paragraph={serviceData.header.description}
        />

        {error && (
          <div className="text-red-600 mb-8 bg-red-50 p-4 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 max-w-[1120px] mx-auto mt-8 md:grid-cols-3 gap-8">
          {serviceData.items.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={serviceIcons[service.iconType] || serviceIcons.shield}
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">{service.title}</h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}