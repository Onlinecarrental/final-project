import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseCard from '../../components/card';
import Button from '../../components/button';

export default function HeroSectionCarForm() {
  const [carModel, setCarModel] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [location, setLocation] = useState('');
  const [priceSort, setPriceSort] = useState('Low to High');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const locationInputRef = useRef(null);

  // Helpers for location handling
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

  const buildDisplayLabelFromLocationIQ = (item) => {
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || '';
    if (!city) return '';
    return `${city}, Pakistan`;
  };

  const extractCityNameFromLocationIQ = (item) => {
    const addr = item.address || {};
    return addr.city || addr.town || addr.village || addr.county || '';
  };

  // Handle form submission
  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (carModel) params.set('brand', carModel);
    if (bodyType) params.set('categories', bodyType);
    if (location) {
      const cityToken = extractCityFromInput(location);
      if (cityToken) params.set('city', cityToken);
    }
    params.set('price', priceSort === 'Low to High' ? 'asc' : 'desc');
    navigate(`/home/best-cars?${params.toString()}`);
  };

  // Location autocomplete effect
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = location.trim();
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
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

  const validateForm = () => {
    const newErrors = {};

    if (!carModel) {
      newErrors.carModel = 'Car model is required';
    }
    if (!bodyType) {
      newErrors.bodyType = 'Body type is required';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmit();
    } else {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      validateForm();
    }
  }, [isSubmitting]);

  return (
    <div className="w-full flex justify-center relative bottom-16 items-center">
      <BaseCard width="max-w-[1280px]" height="auto" padding="24px">
        <div className="grid grid-cols-1 md:grid-cols-5 p-7 gap-4">
          {/* Car Model Dropdown */}
          <div className="flex flex-col relative">
            <label className="mb-2 text-sm font-medium text-gray-700">Car Model</label>
            <select
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.carModel ? 'border-red-500' : 'border-gray-300'
              }`}
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
            {errors.carModel && <p className="mt-1 text-xs text-red-500">{errors.carModel}</p>}
          </div>

          {/* Body Type Dropdown */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Body Type</label>
            <select
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.bodyType ? 'border-red-500' : 'border-gray-300'
              }`}
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
            {errors.bodyType && <p className="mt-1 text-xs text-red-500">{errors.bodyType}</p>}
          </div>

          {/* Location with Autocomplete */}
          <div className="flex flex-col relative">
            <label className="mb-2 text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <input
                type="text"
                ref={locationInputRef}
                className={`pl-4 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => {
                        setLocation(suggestion.label);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
          </div>

          {/* Price Sort Dropdown */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Price Sort</label>
            <select
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.priceSort ? 'border-red-500' : 'border-gray-300'
              }`}
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
            >
              <option value="Low to High">Low to High</option>
              <option value="High to Low">High to Low</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col mt-[23px]">
            <Button
              title="Find the Vehicle"
              width="auto"
              boxShadow={false}
              onClick={() => setIsSubmitting(true)}
              iconRight={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 18l6-6-6-6" />
                </svg>
              }
            />
          </div>
        </div>
      </BaseCard>
    </div>
  );
}
