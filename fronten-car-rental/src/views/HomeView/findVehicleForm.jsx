import { useState, useEffect } from 'react';
import BaseCard from '../../components/card';
import Button from '../../components/button';

export default function CarRentalForm() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
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

    if (!pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (!dropoffLocation.trim()) {
      newErrors.dropoffLocation = 'Drop-off location is required';
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    }

    if (!dropoffDate) {
      newErrors.dropoffDate = 'Drop-off date is required';
    } else if (pickupDate && dropoffDate && new Date(dropoffDate) < new Date(pickupDate)) {
      newErrors.dropoffDate = 'Drop-off date must be after pickup date';
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
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
    });
   
   
    setIsSubmitting(false);
  };

   
  return (
    <div className="w-full flex justify-center relative bottom-16 items-center">
      <BaseCard width="max-w-[1280px]" height="auto" padding="24px">
        <div className="grid grid-cols-1 md:grid-cols-5 p-7 gap-4">
          {/* Drop-off Location */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Drop-off Location</label>
            <input
              type="text"
              className={`pl-4 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.dropoffLocation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Search a location"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
            {errors.dropoffLocation && <p className="mt-1 text-xs text-red-500">{errors.dropoffLocation}</p>}
          </div>

          {/* Pick-up Location */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Pick-up Location</label>
            <input
              type="text"
              className={`pl-4 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Search a location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
            {errors.pickupLocation && <p className="mt-1 text-xs text-red-500">{errors.pickupLocation}</p>}
          </div>

          {/* Pick-up Date */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Pick-up date</label>
            <input
              type="date"
              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.pickupDate ? 'border-red-500' : 'border-gray-300'
              }`}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
            {errors.pickupDate && <p className="mt-1 text-xs text-red-500">{errors.pickupDate}</p>}
          </div>

          {/* Drop-off Date */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">Drop-off date</label>
            <input
              type="date"
              className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.dropoffDate ? 'border-red-500' : 'border-gray-300'
              }`}
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
            {errors.dropoffDate && <p className="mt-1 text-xs text-red-500">{errors.dropoffDate}</p>}
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

        {/* Message Display */}
        
      </BaseCard>
    </div>
  );
}
