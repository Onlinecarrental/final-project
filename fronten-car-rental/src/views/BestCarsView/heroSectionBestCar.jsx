import React, { useState } from 'react';
import heroImage from "../../assets/Bannerimage.jpg";
import BaseCard from "../../components/card";
import Button from '../../components/button';
export default function HerosectionCar() {
  const [priceOpen, setPriceOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState("Low to High");

  const [carModel, setCarModel] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = () => {
    setSubmitted(true);
    if (carModel && location) {
      // perform search logic here
      console.log("Searching with:", carModel, location, selectedPrice);
    }
  };

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
                  <option>Toyota Corolla</option>
                  <option>Honda Civic</option>
                  <option>Ford Mustang</option>
                  <option>BMW 3 Series</option>
                  <option>Hyundai Elantra</option>
                </select>
                {submitted && !carModel && (
                  <p className="text-red-500 text-sm mt-1">Please select a car model</p>
                )}
              </div>

              {/* Location Dropdown */}
              <div className="flex-1 min-w-[250px] relative z-[1px]">
                <div className="text-sm text-start text-gray-600 mb-1">Select Location</div>
                <select
                  className="w-full p-2 rounded bg-white"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                  <option>Houston</option>
                  <option>Miami</option>
                </select>
                {submitted && !location && (
                  <p className="text-red-500 text-sm mt-1">Please select a location</p>
                )}
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
                <Button title="Search" width='200px' height='41px' />
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
