import React, { useState, useEffect } from 'react';
import HeadingTitle from '../../components/heading';
import axios from 'axios';

export default function ServicesBenefit() {
  const [servicesData, setServicesData] = useState({
    header: {
      title: "Our Services & Benefits",
      description: "To make renting easy and hassle-free, we provide a variety of services and advantages. We have you covered with a variety of vehicles and flexible rental terms."
    },
    items: [
      {
        title: "Quality Choice",
        description: "We offer a wide range of high-quality vehicles to choose from, including luxury cars, SUVs, vans, and more.",
        icon: "CheckCircle"
      },
      {
        title: "Affordable Prices",
        description: "Our rental rates are highly competitive and affordable, allowing our customers to enjoy their trips without breaking the bank.",
        icon: "DollarSign"
      },
      {
        title: "Convenient Online Booking",
        description: "With our easy-to-use online booking system, customers can quickly and conveniently reserve their vehicles at any time, anywhere.",
        icon: "Clipboard"
      }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/about/services?timestamp=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });

        if (response.data.success && response.data.data.content) {
          console.log("Services data fetched:", response.data.data.content);

          // Extract the fetched data
          const fetchedData = response.data.data.content;

          // Ensure we have items properly populated
          const itemsData = fetchedData.items || [];

          setServicesData(prevData => ({
            ...prevData,
            ...fetchedData,
            header: {
              ...prevData.header,
              ...(fetchedData.header || {})
            },
            // Ensure items is properly set
            items: itemsData
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services data:', error);
        setLoading(false);
      }
    };

    fetchServicesData();

    // Add this to fetch new data whenever the component is shown/focused
    const handleFocus = () => {
      fetchServicesData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Ensure we have required data
  const headerTitle = servicesData.header?.title || "Our Services & Benefits";
  const headerDescription = servicesData.header?.description || "To make renting easy and hassle-free, we provide a variety of services and advantages.";
  const items = servicesData.items || [];

  // Helper function to render icons based on icon name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "CheckCircle":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "DollarSign":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "Clipboard":
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white py-8 px-4 w-full">
      <div className="max-w-[1250px] mx-auto text-center">
        <HeadingTitle
          title={headerTitle}
          paragraph={headerDescription}
        />
        <div className="grid grid-cols-1 max-w-[1120px] mx-auto mt-8 md:grid-cols-3 gap-8">
          {items.map((service, index) => (
            <div className="flex flex-col items-center" key={index}>
              <div className="bg-gray border-4 border-black p-2 rounded-full mb-4">
                {renderIcon(service.icon)}
              </div>
              <h3 className="font-bold mb-2">{service.title || `Service ${index + 1}`}</h3>
              <p className="text-sm text-gray-700">
                {service.description || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}