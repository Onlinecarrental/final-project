import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import HeadingTitle from '../../components/heading';
import axios from 'axios';

export default function Faqs() {
  const [faqsData, setFaqsData] = useState({
    header: {
      title: "Frequently asked questions",
      description: "Find answers to common questions about our car rental services"
    },
    items: []
  });
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const response = await axios.get(`${API_BASE_URL}/homepage/faqs`);

        if (response.data.success && response.data.data?.content) {
          const fetchedData = response.data.data.content;
          const faqItems = fetchedData.items || fetchedData.faqs || [];

          setFaqsData(prev => ({
            ...prev,
            ...fetchedData,
            header: {
              ...prev.header,
              ...(fetchedData.header || {})
            },
            items: faqItems,
            faqs: faqItems
          }));
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqsData(); // ✅ only once when component mounts
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Safe values
  const headerTitle = faqsData.header?.title || "Frequently asked questions";
  const headerDescription = faqsData.header?.description || "Find answers to common questions about our car rental services";
  const items = faqsData.items || faqsData.faqs || [];

  if (loading) {
    return (
      <div className="w-full bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-white">
      <HeadingTitle
        title={headerTitle}
        paragraph={headerDescription}
      />

      {error && (
        <div className="text-red-600 mb-8 bg-red-50 p-4 rounded text-center">
          {error}
        </div>
      )}

      <div className="space-y-3 max-w-[1020px] mb-12 mt-12 mx-auto">
        {items.map((faq, index) => (
          <div
            key={index}
            className="bg-gray rounded cursor-pointer"
          >
            <button
              className="flex justify-between items-center w-full p-5 text-left"
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

        {items.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 py-8">
            No FAQs available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
