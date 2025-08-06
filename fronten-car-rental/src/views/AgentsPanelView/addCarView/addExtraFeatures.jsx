import React, { useState } from "react";
import Button from "../../../components/button"; // Importing your Button component

export default function AddExtraFeatures() {
  // State to track which features are selected
  const [selectedFeatures, setSelectedFeatures] = useState({
    ac: false,
    sunRoof: false,
    automatic: false,
    parkingSensor: false,
    manual: false,
    cruiseControl: false
  });

  // Handle checkbox changes
  const handleFeatureChange = (feature) => {
    setSelectedFeatures({
      ...selectedFeatures,
      [feature]: !selectedFeatures[feature]
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Selected features:", selectedFeatures);
    // You can add API call or other functionality here in the future
  };

  return (
    
    <div className="w-full mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-4 border-b border-gray">Feature</h2>
      <div className="w-full  h-px mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* AC Checkbox */}
          <div className="flex items-center">
            <div 
              className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
              onClick={() => handleFeatureChange("ac")}
            >
              {selectedFeatures.ac && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="ml-3 text-xl cursor-pointer" onClick={() => handleFeatureChange("ac")}>
              AC
            </label>
          </div>
          
          {/* Automatic Checkbox */}
          <div className="flex items-center">
            <div 
              className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
              onClick={() => handleFeatureChange("automatic")}
            >
              {selectedFeatures.automatic && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="ml-3 text-xl cursor-pointer" onClick={() => handleFeatureChange("automatic")}>
              Automatic
            </label>
          </div>
          
          {/* Manual Checkbox */}
          <div className="flex items-center">
            <div 
              className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
              onClick={() => handleFeatureChange("manual")}
            >
              {selectedFeatures.manual && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="ml-3 text-xl cursor-pointer" onClick={() => handleFeatureChange("manual")}>
              Manual
            </label>
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Sun Roof Checkbox */}
          <div className="flex items-center">
            <div 
              className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
              onClick={() => handleFeatureChange("sunRoof")}
            >
              {selectedFeatures.sunRoof && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="ml-3 text-xl cursor-pointer" onClick={() => handleFeatureChange("sunRoof")}>
              Sun Roof
            </label>
          </div>
          
          {/* Parking Sensor Checkbox */}
          <div className="flex items-center">
            <div 
              className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
              onClick={() => handleFeatureChange("parkingSensor")}
            >
              {selectedFeatures.parkingSensor && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="ml-3 text-xl cursor-pointer" onClick={() => handleFeatureChange("parkingSensor")}>
              Parking Sensor
            </label>
          </div>
          
          {/* Cruise Control Checkbox */}
          <div className="flex items-center">
            <div 
              className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
              onClick={() => handleFeatureChange("cruiseControl")}
            >
              {selectedFeatures.cruiseControl && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="ml-3 text-xl cursor-pointer" onClick={() => handleFeatureChange("cruiseControl")}>
              Cruise Control
            </label>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-center mt-10 mr-12">
        <Button 
          title="Submit"
          onClick={handleSubmit}
          bgColor="bg-[#5937e0]"
          width="150px"
          height="50px"
          rounded="rounded-[10px]"
          shadow="shadow-lg"
        />
      </div>
    </div>
  );
}