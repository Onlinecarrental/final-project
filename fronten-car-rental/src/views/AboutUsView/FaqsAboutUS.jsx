import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import HeadingTitle from '../../components/heading';
import axios from 'axios';

export default function FaqsAboutus() {
  const [faqsData, setFaqsData] = useState({
    header: {
      title: "Frequently asked questions",
      description: "To make working easy and hassle-free, we provide a variety of services and advantages."
    },
    items: [
      {
        question: "What is the difference between a UI and UX Designer?",
        answer: "A UI (User Interface) Designer focuses on the visual elements of a product such as buttons, icons, spacing, typography, and color schemes. They create the look and feel of an interface. A UX (User Experience) Designer focuses on the overall feel and functionality of the product, how users interact with it, and ensuring it meets user needs through research, testing, and iteration."
      },
      {
        question: "How to become a UI designer?",
        answer: "To become a UI designer: 1) Learn design fundamentals including color theory, typography, and layout. 2) Master design tools like Figma, Adobe XD, or Sketch. 3) Study UI principles and patterns. 4) Build a portfolio of projects. 5) Practice by redesigning existing interfaces. 6) Get feedback from professional designers. 7) Network in the design community and apply for entry-level positions or internships."
      },
      {
        question: "What is the difference between a UI and UX Designer?",
        answer: "UI Designers create the visual elements users interact with, focusing on aesthetics and presentation. UX Designers focus on the entire user journey and experience, conducting research to understand user needs and behaviors. While UI is about how things look, UX is about how things work and feel from the user's perspective."
      },
      {
        question: "How to become a UI designer?",
        answer: "The path to becoming a UI designer includes: learning visual design principles, developing proficiency with industry-standard tools, understanding accessibility standards, creating a strong portfolio, gaining practical experience through projects or internships, staying updated with design trends, and potentially pursuing relevant education or certification programs."
      },
      {
        question: "How to become a UI designer?",
        answer: "To become a UI designer, start by learning the fundamentals of visual design, developing technical skills with design software, building a portfolio showcasing your work, networking with other designers, seeking mentorship, participating in design challenges, and applying for junior positions to gain professional experience."
      }
    ]
  });
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqsData = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/about/faqs?timestamp=${timestamp}`, {
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