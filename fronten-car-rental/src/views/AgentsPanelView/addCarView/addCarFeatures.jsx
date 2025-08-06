import React, { useState } from "react";

export default function AddCarFeatures() {
  // State to store form values
  const [formData, setFormData] = useState({
    categories: "",
    transmission: "",
    fuelType: "",
    offRoader: "",
    dailyRate: "",
    weeklyRate: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="w-full mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-4 pb-2 border-b border-gray-300">Feature & Pricing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Categories Field */}
        <div>
          <label htmlFor="categories" className="block text-xl font-medium mb-1">Categries</label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            placeholder="Enter Car Categries"
            className="w-full p-3 bg-gray rounded text-black placeholder-white"
          />
        </div>

        {/* Transmission Field */}
        <div>
          <label htmlFor="transmission" className="block text-xl font-medium mb-1">Transimition</label>
          <input
            type="text"
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            placeholder="Enter Car Transimition"
            className="w-full p-3 bg-gray rounded text-black placeholder-white"
          />
        </div>

        {/* Fuel Type Field */}
        <div>
          <label htmlFor="fuelType" className="block text-xl font-medium mb-1">Fuel type</label>
          <input
            type="text"
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            placeholder="Enter Car Fuel Type"
            className="w-full p-3 bg-gray rounded text-black placeholder-white"
          />
        </div>

        {/* Off Roader Field */}
        <div>
          <label htmlFor="offRoader" className="block text-xl font-medium mb-1">Off roader</label>
          <input
            type="text"
            id="offRoader"
            name="offRoader"
            value={formData.offRoader}
            onChange={handleChange}
            placeholder="Off roader or not ?"
            className="w-full p-3 bg-gray rounded text-black placeholder-white"
          />
        </div>

        {/* Daily Rate Field */}
        <div>
          <label htmlFor="dailyRate" className="block text-xl font-medium mb-1">Daily Fare</label>
          <input
            type="text"
            id="dailyRate"
            name="dailyRate"
            value={formData.dailyRate}
            onChange={handleChange}
            placeholder="Enter Daily Fare"
            className="w-full p-3 bg-gray rounded text-black placeholder-white"
          />
        </div>

        {/* Weekly Rate Field */}
        <div>
          <label htmlFor="weeklyRate" className="block text-xl font-medium mb-1">Weekly Fare</label>
          <input
            type="text"
            id="weeklyRate"
            name="weeklyRate"
            value={formData.weeklyRate}
            onChange={handleChange}
            placeholder="Enter Weekly Fair"
            className="w-full p-3 bg-gray rounded text-black placeholder-white"
          />
        </div>
      </div>
    </div>
  );
}