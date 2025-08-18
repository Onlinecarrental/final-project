import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Fuel, Gauge, Cog } from "lucide-react"; // icons import

import axios from 'axios';
import BaseCard from '../../components/card';

export default function AllBestCars() {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://backend-car-rental-production.up.railway.app/api/cars');

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

  // Helpers to normalize and extract city from a long location string
  const normalize = (str) => (str || '')
    .toLowerCase()
    .replace(/\b(district|division|province|state|city|tehsil)\b/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const extractCityFromQuery = (q) => {
    // We now pass only the city via query (?city=<city>), so just normalize it.
    return normalize(q);
  };

  // Parse query params for filtering
  const query = useMemo(() => new URLSearchParams(locationHook.search), [locationHook.search]);
  const filterBrand = query.get('brand')?.trim().toLowerCase() || '';
  const filterCategory = query.get('categories')?.trim().toLowerCase() || '';
  const filterCity = extractCityFromQuery(query.get('city'));
  const sortPrice = query.get('price') === 'desc' ? 'desc' : 'asc';

  // Only show available cars then filter by query params
  const availableCars = useMemo(() => {
    let list = cars.filter(car => car.status === 'available');
    if (filterBrand) list = list.filter(c => (c.brand || '').toLowerCase() === filterBrand);
    if (filterCategory) list = list.filter(c => (c.categories || '').toLowerCase() === filterCategory);
    if (filterCity) {
      list = list.filter(c => {
        const carCity = normalize(c.city);
        return carCity.includes(filterCity) || filterCity.includes(carCity);
      });
    }
    // sort by dailyRate numeric
    list = list.slice().sort((a, b) => {
      const an = parseFloat(a.dailyRate) || 0;
      const bn = parseFloat(b.dailyRate) || 0;
      return sortPrice === 'desc' ? bn - an : an - bn;
    });
    return list;
  }, [cars, filterBrand, filterCategory, filterCity, sortPrice]);

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
    <div className="bg-white max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mt-20 flex-wrap justify-center">
        {currentCars.map((car) => (
          <BaseCard width='w-[380px]' padding='p-[8px]' height='h-full' key={car._id}>
            <div className="relative h-48 overflow-hidden">
              <img
                src={car.coverImage ? car.coverImage : "/default-car.jpg"}
                alt={car.name}
                className="w-full h-full rounded-[15px] object-cover"
              />
            </div>
          <div className="flex flex-col justify-between h-full">
            <div className="p-4">
              <Link to={`/home/best-cars/${car._id}`}>
                <h3 className="text-[20px] font-[600] text-black font-jakarta">{car.name}</h3>
              </Link>
              <div className="mt-2">
  <p className="text-2xl font-bold">{car.dailyRate} PKR/day</p>

  {/* Light Gray Specs Bar with Icons */}
  <div className="bg-gray rounded-lg p-3 mt-3 flex justify-between text-sm text-black">
    {/* Model */}
    <div className="flex flex-col items-center">
      <Cog size={18} />
      <span>{car.name || "—"}</span>
    </div>

    {/* Seats */}
    <div className="flex flex-col items-center">
      <Users size={18} />
      <span>{car.seats || "—"}</span>
    </div>

    {/* Transmission */}
    <div className="flex flex-col items-center">
      <Gauge size={18} />
      <span>{car.transmission || "—"}</span>
    </div>

    {/* Fuel */}
    <div className="flex flex-col items-center">
      <Fuel size={18} />
      <span>{car.fuelType || "—"}</span>
    </div>
  </div>
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
      {/* Pagination Component */ }
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
    </div >
  );
}