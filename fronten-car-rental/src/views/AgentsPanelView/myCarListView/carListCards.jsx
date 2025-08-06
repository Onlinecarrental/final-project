import React, { useState, useEffect } from "react";
import BaseCard from "../../../components/card";
import Button from "../../../components/button";
import { FaClock, FaCar, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CarListCards() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    rentedCars: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCarStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the logged-in agent's ID
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.uid) {
        throw new Error('Agent not logged in');
      }

      const agentId = userData.uid;

      // Fetch all cars using the existing endpoint
      const response = await axios.get('http://localhost:5000//api/cars');
      
      if (response.data.success) {
        // Filter cars for this agent
        const agentCars = response.data.data.filter(car => car.agentId === agentId);
        
        // Calculate stats
        const totalCars = agentCars.length;
        const availableCars = agentCars.filter(car => car.status === 'available').length;
        const rentedCars = agentCars.filter(car => car.status === 'rented').length;

        setStats({
          totalCars,
          availableCars,
          rentedCars
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch car stats');
      }
    } catch (error) {
      console.error('Error fetching car stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button 
          onClick={fetchCarStats}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white">
      {/* Add Car button centered at the top */}
      <div className="flex justify-center mb-8">
        <Button 
          title="Add Car" 
          bgColor="bg-blue-600" 
          textColor="text-white"
          width="120px"
          onClick={() => navigate('/agent/addcar')}
        />
      </div>
      
      {/* Car cards row */}
      <div className="bg-white p-4 rounded-lg flex flex-wrap justify-center gap-16">
        {/* Total Cars Card */}
        <BaseCard
          width="w-full md:w-auto" 
          height="h-auto"
          padding="px-16 py-8"
          bgColor="bg-gray"
          className="flex flex-col items-center justify-center border"
        >
          <div className="bg-gray p-2 rounded-md border mb-2">
            <FaCar className="text-black" />
          </div>
          <p className="text-center font-medium">Total Cars</p>
          <p className="text-center text-xl font-bold">{stats.totalCars}</p>
        </BaseCard>

        {/* Available Cars Card */}
        <BaseCard
          width="w-full md:w-auto"
          height="h-auto"
          padding="px-16 py-8"
          bgColor="bg-gray"
          className="flex flex-col items-center justify-center border"
        >
          <div className="bg-gray p-2 rounded-md border mb-2">
            <FaCheckCircle className="text-green-500" />
          </div>
          <p className="text-center font-medium">Available Cars</p>
          <p className="text-center text-xl font-bold">{stats.availableCars}</p>
        </BaseCard>

        {/* Rented Cars Card */}
        <BaseCard
          width="w-full md:w-auto"
          height="h-auto"
          padding="px-16 py-8"
          bgColor="bg-gray"
          className="flex flex-col items-center justify-center border"
        >
          <div className="bg-gray p-2 rounded-md border mb-2">
            <FaClock className="text-black" />
          </div>
          <p className="text-center font-medium">Rented Cars</p>
          <p className="text-center text-xl font-bold">{stats.rentedCars}</p>
        </BaseCard>
      </div>
    </div>
  );
}