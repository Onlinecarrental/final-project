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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  // Helpers: clean labels and extract city token
  const normalize = (str) => (str || '')
    .toLowerCase()
    .replace(/\b(district|division|province|state|city|tehsil)\b/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const extractCityFromInput = (value) => {
    const raw = (value || '').toLowerCase();
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
    const blacklist = ['district','division','province','state','country','pakistan','india','punjab','sindh','kpk','balochistan','azad kashmir','pb','pk'];
    for (const p of parts) {
      if (p.length >= 3 && blacklist.every(w => !p.includes(w))) return normalize(p);
    }
    const fallback = parts.find(p => p.length >= 3) || raw;
    return normalize(fallback);
  };

  const buildDisplayLabel = (props) => {
    // Generic builder (kept for flexibility if needed)
    const area = props.neighbourhood || props.suburb || props.district || props.name || '';
    const city = props.city || props.county || '';
    const parts = [];
    if (area) parts.push(area);
    if (city) parts.push(city);
    parts.push('Pakistan');
    const deduped = parts.filter((p, i, arr) => p && arr.findIndex(x => x.toLowerCase() === p.toLowerCase()) === i);
    const cleaned = deduped.map(p => p.replace(/\b(District|Division|Province|State)\b/gi, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    return cleaned.join(', ');
  };

  const buildDisplayLabelFromLocationIQ = (item) => {
    const addr = item.address || {};
    // City-only label: "City, Pakistan"
    const city = addr.city || addr.town || addr.village || addr.county || '';
    if (!city) return '';
    return `${city}, Pakistan`;
  };

  const extractCityNameFromLocationIQ = (item) => {
    const addr = item.address || {};
    return addr.city || addr.town || addr.village || addr.county || '';
  };

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
    if (location) {
      const cityToken = extractCityFromInput(location);
      if (cityToken) params.set('city', cityToken);
    }
    params.set('price', selectedPrice === 'Low to High' ? 'asc' : 'desc');
    navigate(`/home/best-cars?${params.toString()}`);
  };

  // Geoapify autocomplete for Pakistan (no Google Maps)
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = location.trim();
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        // LocationIQ Autocomplete (Pakistan only) - CITIES ONLY
        const url = `https://api.locationiq.com/v1/autocomplete?key=pk.41bdd2ef6f73572085513083abde96b4&q=${encodeURIComponent(query)}&limit=7&countrycodes=pk&normalizecity=1&dedupe=1&addressdetails=1&tag=place:city`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const data = await res.json();
        const items = (Array.isArray(data) ? data : [])
          .map(item => {
            const cityName = extractCityNameFromLocationIQ(item);
            const label = buildDisplayLabelFromLocationIQ(item);
            return {
              id: item.place_id || `${item.lat},${item.lon}`,
              label,
              cityName,
              raw: item,
            };
          })
          .filter(x => !!x.label && !!x.cityName);
        setSuggestions(items);
      } catch (e) {
        console.error('LocationIQ autocomplete error:', e);
        setSuggestions([]);
      }
    };

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchSuggestions, 300);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [location]);

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
        <BaseCard width="w-[1280px]" bgColor="bg-gray" height="h-auto" className="flex gap-16">
          <div className="w-full bg-gray-200/80 p-4 rounded-md">
            <div className="flex flex-wrap gap-2">
              {/* Car Model Dropdown */}
              <div className="flex-1 min-w-[210px] relative z-[1px]">
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
              <div className="flex-1 min-w-[210px] relative z-[1px]">
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
                <div className="flex-1 min-w-[210px] relative z-[1px]">
                <div className="text-sm text-start text-gray-600 mb-1">Location</div>
               
                <input
                  ref={locationInputRef}
                  type="text"
                  id="location"
                  name="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full p-2 rounded bg-white"
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-20 max-h-60 overflow-auto">
                    {suggestions.map(s => (
                      <div
                        key={s.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-left"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setLocation(s.label);
                          setShowSuggestions(false);
                          setSuggestions([]);
                        }}
                      >
                        {s.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>


              {/* Price Filter */}
              <div className="flex-1 min-w-[210px] relative z-[1px]">
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
