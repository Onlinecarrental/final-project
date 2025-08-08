import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import HeadingTitle from '../../components/heading';
import BaseCard from '../../components/card';
import { ChevronDown } from 'lucide-react';

export default function Faqs() {
  const [faqData, setFaqData] = useState({
    header: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about our car rental services'
    },
    faqs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Add ref for measuring content height
  const answerRefs = useRef([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/homepage/faqs`);
        
        if (response.data.success && response.data.data?.content) {
          const content = response.data.data.content;
          
          setFaqData({
            header: {
              title: content.header?.title || faqData.header.title,
              description: content.header?.description || faqData.header.description
            },
            faqs: Array.isArray(content.faqs) ? content.faqs : []
          });
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setError('Failed to load FAQs. Please try again later.');
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Update toggle function
  const toggleAccordion = (index) => {
    setActiveIndex(prev => prev === index ? null : index);
  };

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
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <HeadingTitle 
          title={faqData.header.title}
          paragraph={faqData.header.description}
        />

        {error && (
          <div className="text-red-600 mb-8 bg-red-50 p-4 rounded text-center">
            {error}
          </div>
        )}
        
        <div className="mt-12 space-y-4">
          {faqData.faqs.map((faq, index) => (
            <BaseCard 
              key={index}
              width="w-full"
              height="auto"
              className="cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => toggleAccordion(index)}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg pr-8">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 ${
                      activeIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                <div 
                  ref={el => answerRefs.current[index] = el}
                  className={`
                    mt-4 text-gray-600
                    overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${activeIndex === index ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{
                    maxHeight: activeIndex === index ? answerRefs.current[index]?.scrollHeight + 'px' : '0px',
                    visibility: activeIndex === index ? 'visible' : 'hidden'
                  }}
                >
                  <p className="whitespace-pre-line pb-2">{faq.answer}</p>
                </div>
              </div>
            </BaseCard>
          ))}

          {faqData.faqs.length === 0 && !loading && !error && (
            <div className="text-center text-gray-500 py-8">
              No FAQs available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}