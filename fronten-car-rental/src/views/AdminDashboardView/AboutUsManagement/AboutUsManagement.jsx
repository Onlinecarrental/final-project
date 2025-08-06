import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from './components/HeroSection';
import TrustSection from './components/TrustSection';
import WhyChooseSection from './components/WhyChooseSection';
import CarCollectionSection from './components/CarCollectionSection';
import FaqsSection from './components/FaqsSection';
import ServicesSection from './components/ServicesSection';

const defaultSections = {
  hero: {
    header: {
      title: 'About Our Car Rental',
      description: 'Your trusted partner in mobility'
    },
    image: null,
    bannerImage: null
  },
  trust: {
    header: {
      title: 'Trust & Reliability',
      description: 'Why customers trust us',
      subtitle: 'Our Commitment'
    },
    bannerImage: null,
    items: []
  },
  services: {
    header: {
      title: 'Our Services',
      description: 'What we offer'
    },
    bannerImage: null,
    items: []
  },
  whyChoose: {
    header: {
      title: 'Why Choose Us',
      description: 'Reasons to choose our service'
    },
    bannerImage: null,
    reasons: []
  },
  carCollection: {
    header: {
      title: 'Our Car Collection',
      description: 'Explore our fleet'
    },
    decoration: {
      title: '',
      description: '',
      features: [],
      image: null
    },
    bannerSvg: null,
    cars: []
  },
  faqs: {
    header: {
      title: 'Frequently Asked Questions',
      description: 'Common questions answered'
    },
    bannerImage: null,
    items: []
  }
};

export default function AboutUsManagement({ section = 'hero' }) {
  const [sections, setSections] = useState(defaultSections);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(section);

  useEffect(() => {
    setActiveSection(section);
  }, [section]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('https://backendonlinecar.netlify.app/functions/express-server/api/about');

      if (response.data.success) {
        setSections(prev => ({
          ...defaultSections, // Ensure default structure
          ...response.data.data
        }));
      } else {
        throw new Error(response.data.message || 'Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching about sections:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (sectionType, data) => {
    try {
      setError(null);

      let requestData;
      let headers = {};

      if (data instanceof FormData) {
        requestData = data;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        requestData = { content: data };
        headers['Content-Type'] = 'application/json';
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/about/${sectionType}`,
        requestData,
        { headers }
      );

      if (response.data.success) {
        setSections(prev => ({
          ...prev,
          [sectionType]: response.data.data.content
        }));

        setEditingSection(null);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const sectionProps = {
    sections,
    setSections,
    editingSection,
    setEditingSection,
    handleUpdate
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroSection {...sectionProps} />;
      case 'services':
        return <ServicesSection {...sectionProps} />;
      case 'trust':
        return <TrustSection {...sectionProps} />;
      case 'whyChoose':
        return <WhyChooseSection {...sectionProps} />;
      case 'carCollection':
        return <CarCollectionSection {...sectionProps} />;
      case 'faqs':
        return <FaqsSection {...sectionProps} />;
      default:
        return <HeroSection {...sectionProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">About Us Page Management</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {renderSection()}
    </div>
  );
}