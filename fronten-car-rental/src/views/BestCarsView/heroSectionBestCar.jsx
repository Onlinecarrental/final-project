import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from "../../assets/Bannerimage.jpg";
import BaseCard from "../../components/card";
import Button from '../../components/button';
export default function HerosectionCar() {
  const [priceOpen, setPriceOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState("Low to High");

  const [carModel, setCarModel] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const locationInputRef = useRef(null);

  const handleSearch = () => {
    setSubmitted(true);
    // Build query params (brand, categories, city, price)
    const params = new URLSearchParams();
    if (carModel) params.set('brand', carModel);
    if (location) params.set('city', location);
    // The second dropdown is actually body type (categories). Keep its value in a separate state? We reused 'location' select above.
    // Since the UI uses the second select to set 'location' state, we'll add a separate state for body type below for clarity.
  };

  // New state for body type (categories)
  const [bodyType, setBodyType] = useState("");

  // Re-define handleSearch now that we have bodyType
  const onSearchClick = () => {
    setSubmitted(true);
    const params = new URLSearchParams();
    if (carModel) params.set('brand', carModel);
    if (bodyType) params.set('categories', bodyType);
    if (location) params.set('city', location);
    params.set('price', selectedPrice === 'Low to High' ? 'asc' : 'desc');
    navigate(`/home/best-cars?${params.toString()}`);
  };

  // Load Google Places Autocomplete (restricted to Pakistan)
  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const input = locationInputRef.current;
        if (!input) return;
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ['(cities)'],
          componentRestrictions: { country: 'pk' }
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setLocation(place.formatted_address);
          } else if (place && place.name) {
            setLocation(place.name);
          }
        });
      }
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA-yFdLVn5LA8iu81C2seW5nt6OHiAk5x0&libraries=places&loading=async&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initAutocomplete();
    }
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black/20">
        <div
          className="w-full h-full bg-cover opacity-30 bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
      </div>

      {/* Header Content */}
      <div className="relative z-[1px] font-jakarta flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl font-bold text-black mb-2">Car Listing</h1>
        <p className="text-lg text-black mb-8">
          This is sample of page tagline and you can set it up using page option
        </p>

        {/* Search Bar */}
        <BaseCard width="w-[1100px]" bgColor="bg-gray" height="h-auto" className="flex gap-16">
          <div className="w-full bg-gray-200/80 p-4 rounded-md">
            <div className="flex flex-wrap gap-2">
              {/* Car Model Dropdown */}
              <div className="flex-1 min-w-[250px] relative z-[1px]">
                <div className="text-sm text-start text-gray-600 mb-1">Select Car Model</div>
                <select
                  className="w-full p-2 rounded bg-white"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                >
                  <option value="">-- Select --</option>
                   <option value="Toyota">Toyota</option>
                   <option value="Honda">Honda</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Hyundai">Hyundai</option>
                <option value="Nissan">Nissan</option>
                  <option value="KIA">KIA</option>
                   <option value="Ford">Ford</option>
                    <option value="Tesla">Tesla</option>
                   <option value="Audi">Audi</option>
                   <option value="Peugeot">Peugeot</option>
 </select>
                {submitted && !carModel && (
                  <p className="text-red-500 text-sm mt-1">Please select a car model</p>
                )}
              </div>

              {/* Body Type Dropdown */}
              <div className="flex-1 min-w-[250px] relative z-[1px]">
                <div className="text-sm text-start text-gray-600 mb-1">Select Body Types</div>
                <select
                  className="w-full p-2 rounded bg-white"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                >
                  <option value="">-- Select --</option>
                 <option value="SUV">SUV</option>
    <option value="Crossover">Crossover</option>
    <option value="Wagon">Wagon</option>
    <option value="Family MPV">Family MPV</option>
    <option value="Sport Coupe">Sport Coupe</option>
    <option value="Compact">Compact</option>
    <option value="Coupe">Coupe</option>
    <option value="Sedan">Sedan</option>
    <option value="Limousine">Limousine</option>
    <option value="Convertible">Convertible</option>
    <option value="Off-Road">Off-Road</option>
                </select>
                {submitted && !bodyType && (
                  <p className="text-red-500 text-sm mt-1">Please select a body type</p>
                )}
              </div>
                <div className="flex-1 min-w-[250px] relative z-[1px]">
                <div className="text-sm text-start text-gray-600 mb-1">Location</div>
                <label htmlFor="location">Location</label>
                <input ref={locationInputRef} type="text" id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 rounded bg-white" />
           
              </div>


              {/* Price Filter */}
              <div className="flex-1 min-w-[250px] relative z-[1px]">
                <div className="text-sm text-start text-gray-600 mb-1">Sort by Price</div>
                <div
                  className="bg-white p-2 flex items-center justify-between rounded border cursor-pointer"
                  onClick={() => setPriceOpen(!priceOpen)}
                >
                  <span>{selectedPrice}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${priceOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
                {priceOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-20">
                    {["Low to High", "High to Low"].map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setSelectedPrice(option);
                          setPriceOpen(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="min-w-[200px]">
                <div className="h-6" /> {/* Spacer */}
                <Button title="Search" width='200px' height='41px' onClick={onSearchClick} />
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
