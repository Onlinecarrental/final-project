import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Clock, Trophy, Star, ThumbsUp, Award } from 'lucide-react';
import HeadingTitle from '../../components/heading';
import BaseCard from '../../components/card';

const reasonIcons = {
  'shield-check': <Shield size={24} className="text-blue-600" />,
  'clock': <Clock size={24} className="text-green-600" />,
  'trophy': <Trophy size={24} className="text-yellow-600" />,
  'star': <Star size={24} className="text-purple-600" />,
  'thumbs-up': <ThumbsUp size={24} className="text-indigo-600" />,
  'award': <Award size={24} className="text-red-600" />
};

export default function WhyChooseUs() {
  const [whyChooseData, setWhyChooseData] = useState({
    header: {
      title: 'Why Choose Us',
      description: 'We offer the best experience with our rental deals'
    },
    reasons: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWhyChoose = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/.netlify/functions/api/api/homepage/whyChoose');
        
        if (response.data.success && response.data.data?.content) {
          const content = response.data.data.content;
          
          setWhyChooseData({
            header: {
              title: content.header?.title || whyChooseData.header.title,
              description: content.header?.description || whyChooseData.header.description
            },
            reasons: Array.isArray(content.reasons) ? content.reasons : []
          });
        }
      } catch (error) {
        console.error('Error fetching why choose section:', error);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchWhyChoose();
  }, []);

  const getIcon = (iconName) => {
    return reasonIcons[iconName] || reasonIcons['shield-check'];
  };

  if (loading) {
    return (
      <div className="w-full bg-gray py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg p-6 h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <HeadingTitle 
          title={whyChooseData.header.title}
          paragraph={whyChooseData.header.description}
        />

        {error && (
          <div className="text-red-600 mb-8 bg-red-50 p-4 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 mt-12 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseData.reasons.map((reason, index) => (
            <BaseCard 
              key={index}
              width="w-[300px]"
              className="flex flex-col mx-auto items-center hover:shadow-lg transition-shadow duration-300 p-6" 
              height="h-auto"
            >
              <div className="p-3 rounded-full bg-gray-50 mb-4">
                {getIcon(reason.icon)}
              </div>
              
              <h3 className="font-bold text-xl text-center mb-3">
                {reason.title}
              </h3>
              
              <p className="text-gray-600 text-center">
                {reason.description}
              </p>
            </BaseCard>
          ))}
        </div>
      </div>
    </div>
  );
}