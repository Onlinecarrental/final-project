import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import HeadingTitle from '../../components/heading';
import axios from 'axios';

export default function FaqsAboutus() {
  const [faqsData, setFaqsData] = useState({
    header: { title: "", description: "" },
    items: []
  });

  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqsData = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const response = await axios.get(`${API_BASE_URL}/about/faqs?timestamp=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });

        if (response.data.success && response.data.data.content) {
          console.log("FAQs data fetched:", response.data.data.content);

          // Handle both items and faqs property names
          const fetchedData = response.data.data.content;
          const faqItems = fetchedData.items || fetchedData.faqs || [];

          setFaqsData(prevData => ({
            ...prevData,
            ...fetchedData,
            header: {
              ...prevData.header,
              ...(fetchedData.header || {})
            },
            // Make sure we have both properties for backward compatibility
            items: faqItems,
            faqs: faqItems
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching FAQs data:', error);
        setLoading(false);
      }
    };

    fetchFaqsData();

    // Add this to fetch new data whenever the component is shown/focused
    const handleFocus = () => {
      fetchFaqsData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Ensure we have required data
  const headerTitle = faqsData.header?.title || "Frequently asked questions";
  const headerDescription = faqsData.header?.description || "To make working easy and hassle-free, we provide a variety of services and advantages.";
  // Try both items and faqs property names
  const items = faqsData.items || faqsData.faqs || [];

  return (
    <div className="max-w-[1250px] mx-auto p-6 bg-gray">
      <HeadingTitle
        title={headerTitle}
        paragraph={headerDescription}
      />

      <div className="space-y-3 max-w-[920px] mb-12 mt-12 mx-auto">
        {items.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded cursor-pointer"
          >
            <button
              className="flex justify-between items-center w-full p-4 text-left"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-medium">{faq.question || `Question ${index + 1}`}</span>
              <ChevronDown
                className={`transform text-Blue transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                size={20}
              />
            </button>
            {activeIndex === index && (
              <div className="p-4 pt-2 bg-black text-white">
                <p>{faq.answer || 'No answer provided.'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}