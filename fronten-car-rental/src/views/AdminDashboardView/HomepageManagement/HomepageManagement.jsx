import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import HowItWorksSection from './components/HowItWorksSection';
import WhyChooseSection from './components/WhyChooseSection';
import FaqsSection from './components/FaqsSection';

export default function HomepageManagement({ section = 'hero' }) {
  const [sections, setSections] = useState({
    hero: {
      title: '',
      description: '',
      image: ''
    },
    services: {
      header: {
        title: 'Our Services & Benefits',
        description: 'To make renting easy and hassle-free, we provide a variety of services and advantages'
      },
      items: []
    },
    howItWorks: {
      header: {
        title: 'How It Works',
        description: 'Renting a car has never been easier'
      },
      steps: []
    },
    whyChoose: {
      header: {
        title: 'Why Choose Us',
        description: 'We offer the best experience'
      },
      reasons: [
        {
          title: 'Reason 1',
          description: 'Description 1',
          icon: 'shield-check'
        }
      ]
    },
    faqs: {
      header: {
        title: 'Frequently Asked Questions',
        description: 'Find answers to common questions'
      },
      faqs: []
    }
  });

  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:5000/api/homepage');
      console.log('API Response:', response.data);

      // Default sections structure
      const defaultSections = {
        hero: {
          title: '',
          description: '',
          image: ''
        },
        services: {
          header: {
            title: 'Our Services & Benefits',
            description: 'To make renting easy and hassle-free, we provide a variety of services and advantages'
          },
          items: []
        },
        howItWorks: {
          header: {
            title: 'How It Works',
            description: 'Renting a car has never been easier'
          },
          steps: []
        },
        whyChoose: {
          header: {
            title: 'Why Choose Us',
            description: 'We offer the best experience'
          },
          reasons: []
        },
        faqs: {
          header: {
            title: 'Frequently Asked Questions',
            description: 'Find answers to common questions'
          },
          faqs: []
        }
      };

      if (response.data.success) {
        let formattedData = {};

        // Handle both array and object responses
        if (Array.isArray(response.data.data)) {
          formattedData = response.data.data.reduce((acc, section) => {
            if (section && section.sectionType && section.content) {
              acc[section.sectionType] = section.content;
            }
            return acc;
          }, {});
        } else if (typeof response.data.data === 'object') {
          // If data is already in object format
          formattedData = response.data.data;
        }

        // Merge with defaults, ensuring we keep existing data
        const finalData = Object.keys(defaultSections).reduce((acc, key) => {
          acc[key] = {
            ...defaultSections[key],
            ...(formattedData[key] || {})
          };
          return acc;
        }, {});

        console.log('Formatted Data:', finalData);
        setSections(finalData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError(error.response?.data?.message || error.message);
      // On error, use default sections
      setSections(defaultSections);
    } finally {
      setLoading(false);
    }
  };

  // Update the handleUpdate function
  const handleUpdate = async (sectionType, formData) => {
    try {
      setError(null);
      console.log(`Updating section: ${sectionType}`, formData);

      if (formData instanceof FormData) {
        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/homepage/${sectionType}`,
          formData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          console.log('Update successful:', response.data);

          // Update local state with the new data
          setSections(prev => ({
            ...prev,
            [sectionType]: response.data.data.content
          }));

          return response.data;
        }

        throw new Error(response.data.message || 'Update failed');
      } else {
        // For non-FormData updates (text only)
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/homepage/${sectionType}`,
          { content: formData },
          { 
            headers: { 
              'Content-Type': 'application/json' 
            } 
          }
        );

        if (response.data.success) {
          setSections(prev => ({
            ...prev,
            [sectionType]: response.data.data.content
          }));
          return response.data;
        }

        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      setError(error.message);
      throw error;
    }
  };

  // Add a helper function to get complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http')
      ? imagePath
      : `http://localhost:5000${imagePath}`;
  };

  // Update the prepareFormData helper function
  const prepareFormData = (sectionType, data) => {
    const formData = new FormData();

    // Handle image file
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    // Handle icon file if present
    if (data.icon instanceof File) {
      formData.append('icon', data.icon);
    }

    // Remove file objects from content
    const { image, icon, ...contentData } = data;

    // Add content as stringified JSON
    formData.append('content', JSON.stringify(contentData));

    return formData;
  };

  const renderSection = () => {
    const props = {
      sections,
      setSections,
      editingSection,
      setEditingSection,
      handleUpdate
    };

    switch (section) {
      case 'hero':
        return <HeroSection {...props} />;
      case 'services':
        return <ServicesSection {...props} />;
      case 'howItWorks':
        return <HowItWorksSection {...props} />;
      case 'whyChoose':
        return <WhyChooseSection {...props} />;
      case 'faqs':
        return <FaqsSection {...props} />;
      default:
        return <HeroSection {...props} />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">
        {section.charAt(0).toUpperCase() + section.slice(1)} Section Management
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {renderSection()}
    </div>
  );
}