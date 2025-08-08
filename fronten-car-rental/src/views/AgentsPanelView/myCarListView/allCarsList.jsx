import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaClock } from "react-icons/fa";
import Button from "./../../../components/button";
import BaseCard from "./../../../components/card";

const icons = [
  "./../../src/assets/mileage.svg",
  "./../../src/assets/transmission.svg",
  "./../../src/assets/seating.svg",
  "./../../src/assets/feultype.svg",
];

const Card = ({ car, onEdit, onDelete }) => {
  return (
    <BaseCard bgColor="bg-gray" className="w-auto h-auto p-2">
      <img
        src={`/.netlify/functions/api/${car.coverImage}`}
        alt={car.name}
        className="rounded-[10px] w-full h-[180px] object-cover"
        onError={(e) => {
          e.target.src = "./../../src/assets/default-car.jpg";
        }}
      />
      <div className="px-3 pt-2">
        <h2 className="font-semibold text-[14px]">{car.name}</h2>
        <p className="text-[22px] font-bold pt-1">
          ${car.dailyRate}
          <span className="text-[14px] font-normal">/day</span>
        </p>
      </div>
      <div className="flex justify-between items-center bg-white p-2 mt-2 rounded-[10px]">
        <div className="text-center text-[10px]">
          <img src={icons[0]} alt="mileage" className="w-4 h-4 mx-auto mb-1" />
          <div className="text-[14px] font-bold">{car.model}</div>
        </div>
        <div className="text-center text-[10px]">
          <img src={icons[1]} alt="transmission" className="w-4 h-4 mx-auto mb-1" />
          <div className="text-[14px] font-bold">{car.transmission}</div>
        </div>
        <div className="text-center text-[10px]">
          <img src={icons[2]} alt="seats" className="w-4 h-4 mx-auto mb-1" />
          <div className="text-[14px] font-bold">{car.seats} Seats</div>
        </div>
        <div className="text-center text-[10px]">
          <img src={icons[3]} alt="fuel" className="w-4 h-4 mx-auto mb-1" />
          <div className="text-[14px] font-bold">{car.fuelType}</div>
        </div>
      </div>
      <div className="flex justify-between gap-2 px-3 pt-3 pb-1">
        <Button
          title="Edit"
          width="100%"
          className="text-[14px] px-0 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onEdit(car)}
        />
        <Button
          title="Delete"
          width="100%"
          className="text-[14px] px-0 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => onDelete(car)}
        />
      </div>
    </BaseCard>
  );
};

const Pagination = ({ totalPages, currentPage, setPage }) => {
  return (
    <div className="flex items-center justify-center gap-2 pt-12">
      <Button
        title="Previous"
        width="100px"
        height="40px"
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
      />
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`w-[30px] h-[30px] rounded-[5px] font-bold ${currentPage === i + 1 ? "bg-[#5937e0] text-white" : "bg-gray-200"
            }`}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <Button
        title="Next"
        width="80px"
        height="40px"
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
      />
    </div>
  );
};

const AllCarsList = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const carsPerPage = 4;

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the logged-in agent's ID
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('Raw user data from localStorage:', userData);

      if (!userData) {
        console.error('No user data found in localStorage');
        navigate('/agent-login');
        return;
      }

      if (!userData.uid) {
        console.error('No user ID found in user data');
        navigate('/agent-login');
        return;
      }

      if (userData.role !== 'agent') {
        console.error('User is not an agent:', userData.role);
        navigate('/agent-login');
        return;
      }

      const agentId = userData.uid;
      console.log('Fetching cars for agent:', {
        agentId,
        email: userData.email,
        role: userData.role
      });

      // Fetch all cars
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cars`);
      console.log('Full API Response:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        // Log the first car to see its structure
        if (response.data.data.length > 0) {
          console.log('Sample car data structure:', JSON.stringify(response.data.data[0], null, 2));
        }

        // Filter cars for this agent
        const agentCars = response.data.data.filter(car => {
          // Log all fields in the car object
          console.log('Car object fields:', Object.keys(car));
          console.log('Car data:', JSON.stringify({
            id: car._id,
            name: car.name,
            agentId: car.agentId,
            agent_id: car.agent_id,
            agent: car.agent,
            userId: car.userId,
            user_id: car.user_id,
            currentAgentId: agentId
          }, null, 2));

          // Check all possible agent ID fields
          const carAgentId = car.agentId || car.agent_id || car.agent || car.userId || car.user_id;
          console.log('Car agent ID:', carAgentId);
          console.log('Current agent ID:', agentId);
          console.log('Match:', carAgentId === agentId);

          // If no agent ID is found, log a warning
          if (!carAgentId) {
            console.warn('Car has no agent ID:', {
              carId: car._id,
              carName: car.name,
              allFields: Object.keys(car)
            });
            return false; // Don't include cars without an agent ID
          }

          return carAgentId === agentId && car.status !== 'rented';
        });

        console.log('Filtered agent cars:', JSON.stringify(agentCars, null, 2));

        // Apply status filter if not 'all'
        if (statusFilter !== 'all') {
          const filteredCars = agentCars.filter(car => car.status === statusFilter);
          setCars(filteredCars);
        } else {
          setCars(agentCars);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch cars');
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        setError('Cannot connect to server. Please check if the server is running.');
      } else {
        setError(
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.log('No user data found, redirecting to login');
      navigate('/agent-login');
      return;
    }

    try {
      const parsedUserData = JSON.parse(userData);
      if (!parsedUserData.uid || parsedUserData.role !== 'agent') {
        console.log('Invalid user data or not an agent, redirecting to login');
        navigate('/agent-login');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/agent-login');
      return;
    }

    fetchCars();
  }, [statusFilter, navigate]);

  const handleEdit = async (car) => {
    try {
      // First fetch the car details
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cars/${car._id}`);

      if (response.data.success) {
        // Store car data in localStorage for the form
        localStorage.setItem('editCarData', JSON.stringify(response.data.data));
        // Navigate to edit page
        navigate(`/agent/addcar/${car._id}`);
      } else {
        throw new Error(response.data.message || 'Failed to fetch car details');
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert(error.response?.data?.message || 'Could not open edit page');
    }
  };

  const handleDelete = async (car) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/cars/${car._id}`);

      if (response.data.success) {
        alert('Car deleted successfully!');
        await fetchCars(); // Refresh the list
      } else {
        throw new Error(response.data.message || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">My Cars</h1>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Cars</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>
          <Button
            title="Add New Car"
            bgColor="bg-blue-600"
            textColor="text-white"
            width="120px"
            onClick={() => navigate('/agent/addcar')}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchCars}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl mb-4">No cars available</p>
          <Button
            title="Add Your First Car"
            bgColor="bg-blue-600"
            textColor="text-white"
            width="160px"
            onClick={() => navigate('/agent/addcar')}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {cars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage).map((car) => (
              <Card
                key={car._id}
                car={car}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {Math.ceil(cars.length / carsPerPage) > 1 && (
            <Pagination
              totalPages={Math.ceil(cars.length / carsPerPage)}
              currentPage={currentPage}
              setPage={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AllCarsList;
