import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import HeadingTitle from '../../components/heading';
import BaseCard from '../../components/card';
import axios from 'axios';

export default function WhyChoose() {
  const [whyChooseData, setWhyChooseData] = useState({
    header: {
      title: "WHY CHOOSE US?",
      description: "To make renting easy and hassle-free, we provide a variety of services and advantages."
    },
    reasons: [
      {
        title: "Seamless Experience",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum."
      },
      {
        title: "Seamless Experience",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum."
      },
      {
        title: "Seamless Experience",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum."
      },
      {
        title: "Seamless Experience",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum."
      },
      {
        title: "Seamless Experience",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum."
      },
      {
        title: "Seamless Experience",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum."
      }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhyChooseData = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/about/whyChoose?timestamp=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });

        if (response.data.success && response.data.data.content) {
          console.log("Why Choose data fetched:", response.data.data.content);

          // Extract the fetched data
          const fetchedData = response.data.data.content;

          // Handle both reasons and other possible property names
          const reasonsData = fetchedData.reasons || fetchedData.items || [];

          // Make sure to maintain the default structure if properties are missing
          setWhyChooseData(prevData => ({
            ...prevData,
            ...fetchedData,
            header: {
              ...prevData.header,
              ...(fetchedData.header || {})
            },
            // Store data in both properties for backward compatibility
            reasons: reasonsData,
            items: reasonsData
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching why choose data:', error);
        setLoading(false);
      }
    };

    fetchWhyChooseData();

    // Add this to fetch new data whenever the component is shown/focused
    const handleFocus = () => {
      fetchWhyChooseData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Ensure we have required data
  const headerTitle = whyChooseData.header?.title || "WHY CHOOSE US?";
  const headerDescription = whyChooseData.header?.description || "To make renting easy and hassle-free, we provide a variety of services and advantages.";
  const reasons = whyChooseData.reasons || whyChooseData.items || [];

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading Section */}
        <HeadingTitle
          title={headerTitle}
          paragraph={headerDescription}
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 mt-12 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((feature, index) => (
            <BaseCard width='w-[300px]' className='flex flex-col mx-auto items-center' height='h-auto' key={index} >
              {/* Icon */}
              <BaseCard height='h-auto' width='w-auto' bgColor='bg-gray' boxShadow={false}>
                <Instagram size={24} className="text-purple-600" />
              </BaseCard>

              {/* Title */}
              <h3 className="font-bold text-center mb-2">{feature.title || `Feature ${index + 1}`}</h3>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center">
                {feature.description || ''}
              </p>
            </BaseCard>
          ))}
        </div>
      </div>
    </div>
  );
}