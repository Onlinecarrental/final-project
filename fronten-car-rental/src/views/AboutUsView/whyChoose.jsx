import React, { useState, useEffect } from 'react';
import { Shield, Clock, Trophy, Star, ThumbsUp, Award } from 'lucide-react';
import HeadingTitle from '../../components/heading';
import BaseCard from '../../components/card';
import axios from 'axios';

export default function WhyChoose() {
  const [whyChooseData, setWhyChooseData] = useState({
    header: {
      title: "WHY CHOOSE US?",
      description: "To make renting easy and hassle-free, we provide a variety of services and advantages."
    },
    reasons: []
  });

  useEffect(() => {
    const fetchWhyChooseData = async () => {
      try {
        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const response = await axios.get(`${API_BASE_URL}/about/whyChoose`);

        if (response.data.success && response.data.data.content) {
          const fetchedData = response.data.data.content;
          const reasonsData = fetchedData.reasons || fetchedData.items || [];

          setWhyChooseData({
            ...fetchedData,
            header: {
              ...(fetchedData.header || {})
            },
            reasons: reasonsData,
            items: reasonsData
          });
        }
      } catch (error) {
        console.error('Error fetching why choose data:', error);
      }
    };

    fetchWhyChooseData();
  }, []);

  const headerTitle = whyChooseData.header?.title || "WHY CHOOSE US?";
  const headerDescription =
    whyChooseData.header?.description ||
    "To make renting easy and hassle-free, we provide a variety of services and advantages.";
  const reasons = whyChooseData.reasons || whyChooseData.items || [];

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading Section */}
        <HeadingTitle title={headerTitle} paragraph={headerDescription} />

        {/* Features Grid */}
        <div className="grid grid-cols-1 mt-12 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((feature, index) => (
            <BaseCard
              width="w-[300px]"
              className="flex flex-col mx-auto items-center"
              height="h-auto"
              key={index}
            >
              {/* Icon */}
              <BaseCard height="h-auto" width="w-auto" bgColor="bg-gray" boxShadow={false}>
                {feature.icon ? (
                  <div className="w-6 h-6">
                    {{
                      'shield-check': <Shield size={24} className="text-black" />,
                      'clock': <Clock size={24} className="text-black" />,
                      'trophy': <Trophy size={24} className="text-black" />,
                      'star': <Star size={24} className="text-black" />,
                      'thumbs-up': <ThumbsUp size={24} className="text-black" />,
                      'award': <Award size={24} className="text-black" />
                    }[feature.icon] || <Shield size={24} className="text-black" />}
                  </div>
                ) : (
                  <Shield size={24} className="text-black" />
                )}
              </BaseCard>

              {/* Title */}
              <h3 className="font-bold text-center mb-2">
                {feature.title || `Feature ${index + 1}`}
              </h3>

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
