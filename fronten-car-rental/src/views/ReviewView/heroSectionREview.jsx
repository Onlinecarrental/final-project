import React, { useState } from 'react';
import heroImage from "../../assets/Bannerimage.jpg";
import BaseCard from "../../components/card";
import Button from '../../components/button';

export default function HerosectionCustomer({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = () => {
    setSubmitted(true);
    onSearch(searchTerm);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black/20">
        <div
          className="w-full h-full bg-cover opacity-30 bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      </div>

      {/* Header Content */}
      <div className="relative z-[1px] font-jakarta flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl font-bold text-black mb-2">Customer Review</h1>
        <p className="text-lg text-black mb-8">
          This is sample of page tagline and you can set it up using page option
        </p>

        {/* Search Bar */}
        <BaseCard width="w-full max-w-2xl" bgColor="bg-gray" height="h-auto" className="flex">
          <div className="w-full bg-gray-200/80 p-4 rounded-md">
            <div className="flex flex-wrap gap-2">
              <div className="flex-grow min-w-[200px] relative">
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="w-full p-2 pr-10 rounded bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <Button title="Search" height='41px' onClick={handleSearch} />
              </div>
            </div>
            {submitted && !searchTerm && (
              <p className="text-red-500 text-sm mt-1">Please enter a search term</p>
            )}
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
