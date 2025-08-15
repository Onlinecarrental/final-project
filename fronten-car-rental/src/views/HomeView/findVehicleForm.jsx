import { useState, useEffect } from 'react';
import BaseCard from '../../components/card';
import Button from '../../components/button';

export default function HeroSectionCarForm() {
  const [carModel, setCarModel] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [location, setLocation] = useState('');
  const [priceSort, setPriceSort] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      validateForm();
    }
  }, [isSubmitting]);

  const validateForm = () => {
    const newErrors = {};

    if (!carModel.trim()) {
      newErrors.carModel = 'Car model is required';
    }
    if (!bodyType.trim()) {
      newErrors.bodyType = 'Body type is required';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!priceSort) {
      newErrors.priceSort = 'Please select a price sort option';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmit();
    } else {
      setMessage('Please fix the errors before submitting.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    setMessage('✅ Form submitted successfully!');
    console.log('Form submitted:', {
      carModel,
      bodyType,
      location,
      priceSort,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="w-full flex justify-center relative bottom-16 items-center">
      <BaseCard width="max-w-[1280px]" height="auto" padding="24px">
        <div className="grid grid-cols-1 md:grid-cols-5 p-7 gap-4">
          {/* Car Model */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Car Model</label>
            <input
              type="text"
              className={`pl-4 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.carModel ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter car model"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
            />
            {errors.carModel && <p className="mt-1 text-xs text-red-500">{errors.carModel}</p>}
          </div>

          {/* Body Type */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Body Type</label>
            <input
              type="text"
              className={`pl-4 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.bodyType ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter body type"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
            />
            {errors.bodyType && <p className="mt-1 text-xs text-red-500">{errors.bodyType}</p>}
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              className={`pl-4 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
          </div>

          {/* Price Sort */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Price Sort</label>
            <select
              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.priceSort ? 'border-red-500' : 'border-gray-300'
              }`}
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
            >
              <option value="">Select</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
            {errors.priceSort && <p className="mt-1 text-xs text-red-500">{errors.priceSort}</p>}
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
