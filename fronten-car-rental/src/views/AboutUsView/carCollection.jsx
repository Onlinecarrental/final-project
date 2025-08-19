import { useState, useEffect } from 'react';
import Button from '../../components/button';
import HeadingTitle from '../../components/heading';
import axios from 'axios';
import bluetick from './../../assets/bluetick.svg';
// Add a helper function to format image URLs
const getImageUrl = (path) => {
  if (!path) return "../src/assets/AUcar.svg";
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  if (path.startsWith('uploads/')) return `${API_BASE_URL}/${path}`;
  return path;
};

const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";

export default function CarCollection() {
  const [carCollectionData, setCarCollectionData] = useState({
    header: {
      title: "Our Impressive Collection of Car",
      description: "Find the perfect car for any journey—from luxurious rides to rugged off-roaders."
    },
    categories: [
      { title: "Popular Car", path: "/popular-cars" },
      { title: "Luxury Car", path: "/luxury-cars" },
      { title: "Vintage Car", path: "/vintage-cars" },
      { title: "Family Car", path: "/family-cars" },
      { title: "Off-Road Car", path: "/offroad-cars" }
    ],
    content: {
      title: "We Are More Than",
      description: [
        "Lorem pretium fermentum quam, sit amet cursus ante sollicitudin velen morbi consesua the miss sustion consation porttitor orci sit amet iaculis nisan.",
        "Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttito",
        "Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttito"
      ],
      features: [
        "24/7 Roadside Assistance",
        "Free Cancellation & Return",
        "Rent Now Pay When You Arrive"
      ],
      image: "../src/assets/AUcar.svg"
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchCarCollectionData = async () => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await axios.get(`${API_BASE_URL}/about/carCollection?timestamp=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      if (response.data.success && response.data.data.content) {
        console.log("CarCollection data fetched:", response.data.data.content);

        // Extract the fetched data
        const fetchedData = response.data.data.content;

        // Handle both categories and cars property names
        const categoriesData = fetchedData.categories || fetchedData.cars || [];

        // Handle content from either content or decoration property
        const contentData = fetchedData.content || fetchedData.decoration || {};

        // Process the features from decoration if needed
        let processedFeatures = contentData.features || [];

        // Debug image paths received from the API
        console.log("Content image:", contentData.image);
        console.log("Decoration image:", fetchedData.decoration?.image);
        console.log("Banner SVG:", fetchedData.bannerSvg);
        console.log("Header data:", fetchedData.header);

        // Make sure to maintain the default structure if properties are missing
        setCarCollectionData(prevData => {
          console.log("Setting car collection data:", {
            prevHeader: prevData.header,
            newHeader: fetchedData.header
          });

          return {
            ...prevData,
            ...fetchedData,
            header: {
              ...prevData.header,
              ...(fetchedData.header || {})
            },
            content: {
              ...prevData.content,
              ...contentData,
              // Ensure features is properly set
              features: processedFeatures,
              // Use decoration image if content image is not available
              image: contentData.image || fetchedData.decoration?.image || prevData.content.image
            },
            // Store data in both properties for backward compatibility
            categories: categoriesData,
            cars: categoriesData,
            // Save banner image if present
            bannerSvg: fetchedData.bannerSvg || prevData.bannerSvg
          };
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching car collection data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarCollectionData();

    // Add event listeners to refresh data when needed
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCarCollectionData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchCarCollectionData);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchCarCollectionData);
    };
  }, []);

  const handleCardClick = (path) => {
    window.location.href = path;
  };

  // Function to manually reload data
  const reloadData = () => {
    setLoading(true);
    fetchCarCollectionData();
  };

  // Ensure we have categories and other required data
  const categories = carCollectionData.categories || carCollectionData.cars || [];
  const headerTitle = carCollectionData.header?.title || "Our Impressive Collection of Car";
  const headerDescription = carCollectionData.header?.description || "Find the perfect car for any journey";
  const contentTitle = carCollectionData.content?.title || "We Are More Than";
  const contentDescription = carCollectionData.content?.description || [];
  const contentFeatures = carCollectionData.content?.features || [];

  // Get image from various possible locations
  let contentImage = carCollectionData.content?.image ||
    carCollectionData.decoration?.image ||
    "../src/assets/AUcar.svg";

  // Helper function to get feature text (handles both string and object formats)
  const getFeatureText = (feature) => {
    if (typeof feature === 'string') {
      return feature;
    } else if (feature && typeof feature === 'object' && feature.text) {
      return feature.text;
    }
    return '';
  };

  return (
    <div className="mt-20 py-9 bg-gray">

      <div className="max-w-[1280px] mx-auto p-6">
        <HeadingTitle
          title={headerTitle}
          paragraph={headerDescription}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-6">
        {categories.map((category, idx) => (
          <Button
            textColor='black'
            key={category.title || idx}
            title={category.title || `Category ${idx + 1}`}
            bgColor="bg-white"
            hoverBgColor="hover:bg-[#000000]"
            hoverTextColor="hover:text-white"
            width="180px"
            onClick={() => handleCardClick(category.path || '#')}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start mt-10 p-6 bg-gray max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 pl-8 space-y-6 pr-4">
          <h2 className="text-4xl font-bold">{contentTitle}</h2>

          {Array.isArray(contentDescription) ? (
            contentDescription.map((paragraph, index) => (
              <p key={index} className="text-lg">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-lg">{contentDescription.toString()}</p>
          )}

          <div className="space-y-3 mt-6">
            {Array.isArray(contentFeatures) && contentFeatures.map((feature, index) => (
              <div className="flex items-center" key={index}>
                <div className="mr-2 rounded-full p-1">
                  <img
                    src={bluetick}
                    alt="Checkmark"
                    className="h-6 w-6"
                    onError={(e) => {
                      console.error('Error loading blue tick icon');
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-base font-medium">{getFeatureText(feature)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          <div className="rounded-lg overflow-hidden">
            <img
              src={getImageUrl(contentImage)}
              alt="Luxury car"
              className="w-full h-auto mt-10 mb-10 object-cover rounded-lg"
              onError={(e) => {
                console.log("Image error, falling back to default", e.target.src);
                e.target.src = "/src/assets/AUcar.svg";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
