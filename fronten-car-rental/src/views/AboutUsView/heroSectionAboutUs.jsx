import { useState, useEffect } from 'react';
import heroImage from "../../assets/Bannerimage.jpg";
import axios from 'axios';

export default function HerosectionAboutUs() {
  const [priceOpen, setPriceOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState("Low to High");
  const [heroData, setHeroData] = useState({
    title: "About Us",
    description: "This is sample of page tagline and you can set it up using page option",
    image: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const response = await axios.get(`${API_BASE_URL}/about/hero?timestamp=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });

        if (response.data.success && response.data.data.content) {
          console.log("Hero data fetched:", response.data.data.content);

          // Extract the fetched data
          const fetchedData = response.data.data.content;

          // Handle data from both direct properties and header properties
          const title = fetchedData.title || fetchedData.header?.title || "About Us";
          const description = fetchedData.description || fetchedData.header?.description ||
            "This is sample of page tagline and you can set it up using page option";
          const image = fetchedData.image || "";

          setHeroData(prevData => ({
            ...prevData,
            title,
            description,
            image
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setLoading(false);
      }
    };

    fetchHeroData();

    // Add this to fetch new data whenever the component is shown/focused
    const handleFocus = () => {
      fetchHeroData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Helper function to get image URL
  const getImageUrl = (path) => {
    if (!path) return heroImage;
    if (path.startsWith('http')) return path;
    return `/.netlify/functions/api${path}`;
  };

  // Ensure we have required data
  const title = heroData.title || "About Us";
  const description = heroData.description || "This is sample of page tagline and you can set it up using page option";
  const imagePath = heroData.image || "";

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black/20">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageUrl(imagePath)})`,
            opacity: 0.7
          }}
        />
      </div>

      {/* Header Content */}
      <div className="relative z-[1px] flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl font-bold text-black mb-2">{title}</h1>
        <p className="text-lg text-black mb-8">
          {description}
        </p>
      </div>
    </div>
  );
}