import React, { useState, useEffect } from 'react';
import BaseCard from '../../components/card';
import axios from 'axios';

export default function TrustProperties() {
  const [trustData, setTrustData] = useState({
    title: "YOUR Trusted Patner is in a",
    subtitle: "A Car Rental Company",
    features: [
      {
        icon: "../src/assets/Tp-1.svg",
        description: "Lorem pretium fermentum quam, sit amet cursus ante sollicitudin velen morbi consesua the miss sustion consation porttitor orci sit amet iaculis nisan."
      },
      {
        icon: "../src/assets/Tp-2.svg",
        description: "Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttito"
      },
      {
        icon: "../src/assets/Tp-1.svg",
        description: "Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttito"
      },
      {
        icon: "../src/assets/Tp-2.svg",
        description: "Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttito"
      }
    ],
    image: "../src/assets/AUcar.svg"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/about/trust?timestamp=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });

        if (response.data.success && response.data.data.content) {
          console.log("Trust data fetched:", response.data.data.content);

          // Extract the fetched data
          const fetchedData = response.data.data.content;

          // Handle both features and items property names
          const featuresData = fetchedData.features || fetchedData.items || [];

          setTrustData(prevData => ({
            ...prevData,
            ...fetchedData,
            // Store data in both properties for backward compatibility
            features: featuresData,
            items: featuresData
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trust data:', error);
        setLoading(false);
      }
    };

    fetchTrustData();
  }, []);

  // Ensure we have required data
  const title = trustData.title || "YOUR Trusted Partner is in a";
  const subtitle = trustData.subtitle || "A Car Rental Company";
  const features = trustData.features || trustData.items || [];
  const imagePath = trustData.image || "../src/assets/AUcar.svg";

  return (
    <div className="flex flex-col md:flex-row gap-10 mt-8 justify-between items-start p-6 bg-white max-w-6xl mx-auto">
      <div className="w-full md:w-1/2 space-y-9 ">
        <div>
          <h2 className="text-4xl font-bold mb-2">{title}</h2>
          <h3 className="text-4xl font-bold">{subtitle}</h3>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div className="flex gap-5 items-start" key={index}>
              <BaseCard boxShadow={false} width='w-[110px]' className='flex items-center justify-center' padding='p-0' bgColor='bg-gray' height='h-[52px]'>
                <img
                  src={feature.icon || "../src/assets/Tp-1.svg"}
                  alt="Feature icon"
                  className='w-[50px] h-[40px]'
                  onError={(e) => {
                    e.target.src = "../src/assets/Tp-1.svg";
                  }}
                />
              </BaseCard>
              <p className="text-base">{feature.description || ''}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <div className="rounded-lg overflow-hidden">
          <img
            src={imagePath ? (imagePath.startsWith('http') ? imagePath : `http://localhost:5000/${imagePath}`) : "../src/assets/AUcar.svg"}
            alt="Luxury car"
            className="w-full h-auto mt-10 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "../src/assets/AUcar.svg";
            }}
          />
        </div>
      </div>
    </div>
  );
}