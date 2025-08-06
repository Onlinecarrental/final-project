import React, { useEffect, useState } from "react";
import BaseCard from "../../../components/card";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statusColors = {
  available: "bg-green-500"
};

const CarListingDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError("");
      if (!user.uid) return;
      const res = await axios.get('http://localhost:5000//api/cars');
      // Only show available cars for this agent
      const agentCars = (res.data.data || []).filter(car => car.agentId === user.uid && car.status === 'available');
      setCars(agentCars);
    } catch (err) {
      setError("Failed to load cars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line
  }, [user.uid]);

  const handleEdit = async (car) => {
    try {
      // First fetch the car details
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cars/${car._id}`);
      if (response.data.success) {
        localStorage.setItem('editCarData', JSON.stringify(response.data.data));
        navigate(`/agent/addcar/${car._id}`);
      } else {
        throw new Error(response.data.message || 'Failed to fetch car details');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Could not open edit page');
    }
  };

  const handleDelete = async (car) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cars/${car._id}`);
      if (response.data.success) {
        alert('Car deleted successfully!');
        await fetchCars();
      } else {
        throw new Error(response.data.message || 'Failed to delete car');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseCard
      width="w-full"
      height="full"
      padding="p-6"
      className="mx-auto border m-14"
    >
      <h1 className="text-center text-3xl font-bold mb-6">Car Listing</h1>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {cars.slice(-5).reverse().map((car) => (
            <div
              key={car._id}
              className="flex items-center justify-between bg-gray rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <span className={`w-4 h-4 rounded-full ${statusColors[car.status] || 'bg-gray-400'}`}></span>
                <div className="w-10 h-10 rounded-md overflow-hidden bg-white">
                  <img
                    src={`http://localhost:5000//${car.coverImage}`}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-lg">{car.name}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  title="Edit"
                  width="80px"
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleEdit(car)}
                />
                <Button
                  title="Delete"
                  width="80px"
                  className="text-xs bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(car)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseCard>
  );
};

export default CarListingDashboard;