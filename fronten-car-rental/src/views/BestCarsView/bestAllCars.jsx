import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BaseCard from '../../components/card';

export default function AllBestCars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://backendonlinecar.netlify.app/functions/express-server/api/cars');

        // Check if response has the correct structure and data is an array
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setCars(response.data.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Blue"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center py-4">
      {error}
    </div>
  );

  // Only show available cars
  const availableCars = cars.filter(car => car.status === 'available');
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = availableCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(availableCars.length / carsPerPage);

  // Handle page changes
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleRentNow = (car) => {
    // Navigate to booking form with car details including agent information
    navigate('/home/bookingform', {
      state: {
        carDetails: {
          id: car._id,
          name: car.name,
          model: car.model,
          dailyRate: car.dailyRate,
          weeklyRate: car.weeklyRate,
          coverImage: car.coverImage,
          year: car.year,
          transmission: car.transmission,
          fuelType: car.fuelType,
          seats: car.seats,
          ac: car.ac,
          agentId: car.agentId // Include the agent ID who owns this car
        }
      }
    });
  };

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col md:flex-row gap-4 mt-20 flex-wrap justify-center">
        {currentCars.map((car) => (
          <BaseCard width='w-[380px]' padding='p-[8px]' height='h-full' key={car._id}>
            <div className="relative h-48 overflow-hidden">
              <img
                src={`https://backendonlinecar.netlify.app/functions/express-server/${car.coverImage}`}
                alt={car.name}
                className="w-full h-full rounded-[15px] object-cover"
              />
            </div>
            <div className="p-4">
              <Link to={`/home/best-cars/${car._id}`}>
                <h3 className="text-[20px] font-[600] text-black font-jakarta">{car.name}</h3>
              </Link>
              <div className="mt-2">
                <p className="text-2xl font-bold">${car.dailyRate}/day</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>Model: {car.model}</div>
                  <div>Seats: {car.seats}</div>
                  <div>Transmission: {car.transmission}</div>
                  <div>Fuel: {car.fuelType}</div>
                </div>
                <button
                  onClick={() => handleRentNow(car)}
                  className="w-full mt-4 bg-Blue text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Rent Now
                </button>
              </div>
            </div>
          </BaseCard>
        ))}
      </div>
      {/* Pagination Component */}
      <div className="flex justify-center mt-8 mb-8">
        <div className="flex gap-4">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-Blue text-white px-4 py-2 rounded-[10px] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
          >
            <div className="flex justify-between gap-2 items-center">
              <span>Previous</span>
            </div>
          </button>

          {/* Page Numbers */}
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-4 py-2 rounded ${currentPage === number
                ? 'bg-Blue text-white'
                : 'bg-gray text-white hover:bg-Blue'
                }`}
            >
              {number}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`bg-Blue text-white px-4 py-2 rounded-[10px] ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
          >
            <div className="flex items-center gap-2">
              <span>Next</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}