import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Button from "../../../components/button";

export default function AddCarInfo() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get car ID from URL if editing
  const [isEditing, setIsEditing] = useState(false);

  // State for form values
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    model: "",
    year: "",
    licenseNo: "",
    color: "",
    seats: "",
    
    // Features & Pricing
    categories: "",
    transmission: "",
    fuelType: "",
    offRoader: "",
    dailyRate: "",
    weeklyRate: "",
    
    // Images
    coverImage: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });

  // State for features
  const [selectedFeatures, setSelectedFeatures] = useState({
    ac: false,
    sunRoof: false,
    automatic: false,
    parkingSensor: false,
    manual: false,
    cruiseControl: false
  });

  // State for image previews
  const [imagePreviews, setImagePreviews] = useState({
    coverImage: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });

  // State for submission status
  const [submitStatus, setSubmitStatus] = useState({
    show: false,
    success: false,
    message: ''
  });

  // Fetch car data if editing
  useEffect(() => {
    const fetchCarData = async () => {
      if (id) {
        try {
          setIsEditing(true);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars/${id}`);
          
          if (response.data.success) {
            const carData = response.data.data;
            
            // Set form data
            setFormData({
              name: carData.name || "",
              model: carData.model || "",
              year: carData.year || "",
              licenseNo: carData.licenseNo || "",
              color: carData.color || "",
              seats: carData.seats || "",
              categories: carData.categories || "",
              transmission: carData.transmission || "",
              fuelType: carData.fuelType || "",
              offRoader: carData.offRoader || "",
              dailyRate: carData.dailyRate || "",
              weeklyRate: carData.weeklyRate || "",
              coverImage: null,
              image1: null,
              image2: null,
              image3: null,
              image4: null
            });

            // Set features
            setSelectedFeatures(carData.features || {
              ac: false,
              sunRoof: false,
              automatic: false,
              parkingSensor: false,
              manual: false,
              cruiseControl: false
            });

            // Set image previews
            setImagePreviews({
              coverImage: `/.netlify/functions/api/${carData.coverImage}`,
              image1: carData.image1 ? `/.netlify/functions/api/${carData.image1}` : null,
              image2: carData.image2 ? `/.netlify/functions/api/${carData.image2}` : null,
              image3: carData.image3 ? `/.netlify/functions/api/${carData.image3}` : null,
              image4: carData.image4 ? `/.netlify/functions/api/${carData.image4}` : null
            });
          }
        } catch (error) {
          console.error('Error fetching car:', error);
          alert('Failed to load car data');
          navigate('/home/best-cars');
        }
      }
    };

    fetchCarData();
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle feature toggles
  const handleFeatureChange = (feature) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  // Handle image upload
  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        [imageType]: file
      }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [imageType]: previewUrl
      }));
    }
  };

  // Update handleSubmit for both add and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get the logged-in agent's ID
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('Raw user data from localStorage:', userData);
      
      if (!userData) {
        setSubmitStatus({
          show: true,
          success: false,
          message: 'No user data found. Please log in again.'
        });
        return;
      }

      if (!userData.uid) {
        setSubmitStatus({
          show: true,
          success: false,
          message: 'Invalid user data. Please log in again.'
        });
        return;
      }

      if (userData.role !== 'agent') {
        setSubmitStatus({
          show: true,
          success: false,
          message: 'Only agents can add cars. Please log in as an agent.'
        });
        return;
      }

      console.log('Current user data:', {
        uid: userData.uid,
        email: userData.email,
        role: userData.role
      });

      // Validate required fields
      const requiredFields = [
        'name', 'model', 'year', 'licenseNo', 'color', 'seats',
        'categories', 'transmission', 'fuelType', 'offRoader',
        'dailyRate', 'weeklyRate'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        setSubmitStatus({
          show: true,
          success: false,
          message: `Please fill in: ${missingFields.join(', ')}`
        });
        return;
      }

      // Check for cover image
      if (!formData.coverImage && !isEditing) {
        setSubmitStatus({
          show: true,
          success: false,
          message: 'Please upload a cover image'
        });
        return;
      }

      const formDataToSend = new FormData();

      // Add agent ID with multiple field names to ensure it's saved
      formDataToSend.append('agentId', userData.uid);
      formDataToSend.append('agent_id', userData.uid);
      formDataToSend.append('agent', userData.uid);
      formDataToSend.append('userId', userData.uid);
      formDataToSend.append('user_id', userData.uid);
      console.log('Adding car with agent ID:', userData.uid);

      // Add all text fields
      Object.keys(formData).forEach(field => {
        if (field !== 'coverImage' && field !== 'image1' && field !== 'image2' && field !== 'image3' && field !== 'image4') {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Add features
      formDataToSend.append('features', JSON.stringify(selectedFeatures));

      // Add status field
      formDataToSend.append('status', 'available');

      // Log the complete form data
      console.log('Form data being sent:', {
        ...Object.fromEntries(formDataToSend.entries()),
        features: selectedFeatures
      });

      // Add images only if they're new or changed
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      ['image1', 'image2', 'image3', 'image4'].forEach(imageKey => {
        if (formData[imageKey]) {
          formDataToSend.append(imageKey, formData[imageKey]);
        }
      });

      // Make API request based on whether we're adding or editing
      const response = await axios({
        method: isEditing ? 'put' : 'post',
        url: isEditing ? `${import.meta.env.VITE_API_URL}/cars/${id}` : `${import.meta.env.VITE_API_URL}/cars`,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('API Response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add car');
      }

      // Verify the car was created with the correct agent ID
      const createdCar = response.data.data;
      console.log('Created car data:', {
        id: createdCar._id,
        name: createdCar.name,
        agentId: createdCar.agentId,
        agent_id: createdCar.agent_id,
        agent: createdCar.agent,
        userId: createdCar.userId,
        user_id: createdCar.user_id,
        status: createdCar.status
      });

      // Verify agent ID was saved
      if (!createdCar.agentId && !createdCar.agent_id && !createdCar.agent && !createdCar.userId && !createdCar.user_id) {
        throw new Error('Car was created but agent ID was not saved');
      }

      setSubmitStatus({
        show: true,
        success: true,
        message: isEditing ? 'Car updated successfully!' : 'Car added successfully!'
      });

      // Show success message before redirecting
      setTimeout(() => {
        navigate('/agent/carlist');
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        show: true,
        success: false,
        message: error.message || (isEditing ? 'Failed to update car' : 'Failed to add car')
      });
    }
  };

  // Update the form title based on mode
  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        {isEditing ? 'Edit Car' : 'Add New Car'}
      </h1>
      
      {/* Basic Info Section */}
      <div className="w-full mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray">Car Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-1">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Car Name"
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>

          {/* Model Field */}
          <div>
            <label htmlFor="model" className="block text-lg font-medium mb-1">Model:</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Enter Car Model"
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>

          {/* Year Field */}
          <div>
            <label htmlFor="year" className="block text-lg font-medium mb-1">Year</label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter Model Year"
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>

          {/* License Number Field */}
          <div>
            <label htmlFor="licenseNo" className="block text-lg font-medium mb-1">License no:</label>
            <input
              type="text"
              id="licenseNo"
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleChange}
              placeholder="Enter License no."
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>

          {/* Color Field */}
          <div>
            <label htmlFor="color" className="block text-lg font-medium mb-1">Color:</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter Color"
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>

          {/* Seats Field */}
          <div>
            <label htmlFor="seats" className="block text-lg font-medium mb-1">Seats</label>
            <input
              type="number"
              id="seats"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              placeholder="Enter Total Seats"
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>
        </div>
      </div>
      <div className="w-full mx-auto px-4 py-6">
  <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray">Car Images</h2>
  
  {/* Cover Image */}
  <div className="mb-8">
    <label className="block text-lg font-bold mb-2 text-gray-700">
      Cover Image (Required) <span className="text-red-500">*</span>
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, 'coverImage')}
        className="w-full mb-2"
      />
      {imagePreviews.coverImage && (
        <div className="mt-2">
          <img
            src={imagePreviews.coverImage}
            alt="Cover preview"
            className="max-w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  </div>

  {/* Additional Images */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((num) => (
      <div key={num} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <label className="block text-lg font-bold mb-2 text-gray-700">
          Additional Image {num}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, `image${num}`)}
          className="w-full mb-2"
        />
        {imagePreviews[`image${num}`] && (
          <div className="mt-2">
            <img
              src={imagePreviews[`image${num}`]}
              alt={`Preview ${num}`}
              className="max-w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    ))}
  </div>
  </div>
      {/* Features & Pricing Section */}
      <div className="w-full mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-4 pb-2 border-b border-gray-300">Features & Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Categories Field */}
          <div>
            <label htmlFor="categories" className="block text-xl font-medium mb-1">Categories</label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="Enter Car Categories"
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>

          {/* Transmission Field */}
          <div>
            <label htmlFor="transmission" className="block text-xl font-medium mb-1">Transmission</label>
            <input
              type="text"
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              placeholder="Enter Car Transmission"
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
              placeholder="Off roader or not?"
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
              placeholder="Enter Weekly Fare"
              className="w-full p-3 bg-gray rounded text-black placeholder-white"
            />
          </div>
        </div>
      </div>

      {/* Features Checkboxes Section */}
      <div className="w-full mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-4 border-b border-gray">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* AC, Automatic, Manual */}
            {['ac', 'automatic', 'manual'].map(feature => (
              <div key={feature} className="flex items-center">
                <div 
                  className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
                  onClick={() => handleFeatureChange(feature)}
                >
                  {selectedFeatures[feature] && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <label className="ml-3 text-xl cursor-pointer capitalize" onClick={() => handleFeatureChange(feature)}>
                  {feature.replace(/([A-Z])/g, ' $1')}
                </label>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Sun Roof, Parking Sensor, Cruise Control */}
            {['sunRoof', 'parkingSensor', 'cruiseControl'].map(feature => (
              <div key={feature} className="flex items-center">
                <div 
                  className="w-8 h-8 flex items-center justify-center bg-black cursor-pointer"
                  onClick={() => handleFeatureChange(feature)}
                >
                  {selectedFeatures[feature] && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <label className="ml-3 text-xl cursor-pointer capitalize" onClick={() => handleFeatureChange(feature)}>
                  {feature.replace(/([A-Z])/g, ' $1')}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Section */}
      {submitStatus.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          submitStatus.success ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <div className="flex items-center">
            {submitStatus.success ? (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p className="text-lg font-semibold">{submitStatus.message}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center mt-10 mr-12">
        <Button 
          type="submit"
          title={isEditing ? "Update Car" : "Add Car"}
          onClick={handleSubmit}
          bgColor="bg-[#5937e0]"
          width="150px"
          height="50px"
          rounded="rounded-[10px]"
          shadow="shadow-lg"
          disabled={submitStatus.show}
        />
      </div>
    </form>
  );
}