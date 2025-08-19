import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import HeadingTitle from '../../components/heading';
import Button from '../../components/button';
import { Users, Fuel, Gauge, Cog } from "lucide-react"; // icons import
import BaseCard from '../../components/card';

const bodyTypes = [
  { id: 'Sport Coupe', name: 'Sports Car' },
  { id: 'Off-Road', name: 'Off-Road' },
  { id: 'Family MPV', name: 'Family MPV' },
  { id: 'Hatchback', name: 'Hatchback' },
  { id: 'Sedan', name: 'Sedan' },
  { id: 'SUV', name: 'SUV' }


];

const CarCollection = () => {
  const navigate = useNavigate();
  const [selectedBodyType, setSelectedBodyType] = useState(bodyTypes[0].id); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://backend-car-rental-production.up.railway.app/api/cars');
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

  const handleBodyTypeClick = (bodyType) => {
    setSelectedBodyType(prev => prev === bodyType ? '' : bodyType);
  };

  // filter cars according to selected tab
  const filteredCars = cars
    .filter((car) => car.categories?.toLowerCase() === selectedBodyType.toLowerCase())
    .slice(0, 6);

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

  return (
    <div className="mt-20 py-9 bg-gray">
      <div className="max-w-[1280px] mx-auto p-6">
        <HeadingTitle
          title="Explore Our Car Collection"
          paragraph="Find the perfect car for any journey—from luxurious rides to rugged off-roaders."
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-6">
        {bodyTypes.map((type) => (
          <Button
            textColor={selectedBodyType === type.id ? 'white' : 'black'}
            key={type.id}
            title={type.name}
            bgColor={selectedBodyType === type.id ? 'bg-black' : 'bg-white'}
            hoverBgColor="hover:bg-[#000000]"
            hoverTextColor="hover:text-white"
            width="180px"
            onClick={() => handleBodyTypeClick(type.id)}
          />
        ))}
      </div>


      <div className="flex flex-col md:flex-row max-w-[1200px] gap-4 mt-10 flex-wrap justify-center">
        {filteredCars.slice(0, 6).map((car) => (
          <BaseCard width='w-[380px]' padding='p-[8px]' height='h-full' key={car.id} >
            <div className="relative h-48 overflow-hidden">

              <img
                src={car.coverImage || '/default-car.jpg'}
                alt={car.name}
                className="w-full h-full rounded-[15px] object-cover"
              />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="p-4 ">

                <Link to={`/home/best-cars/${car._id}`}>
                  <h3 className="text-[20px] font-[600] text-black font-jakarta">{car.name}</h3>
                </Link>
                <div className="mt-2">
                  <p className="text-[28px] font-bold">{car.dailyRate || 'N/A'}
                    PKR/day</p>

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
                <div className='mt-2 ml-[5px]' >
                  <Button
                    boxShadow={false}
                    to='/home/bookingform'
                    title="Rent Now"
                    width='320px'
                    height='40px'
                    onClick={() => navigate('/home/bookingform', { state: { carDetails: car } })}
                  />
                </div>


              </div>
            </div>
          </BaseCard>
        ))}
      </div>
      <div className='flex justify-center  mt-16 ' >
        <Button width='auto' height='60px' title="View All Cars" iconRight={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 18l6-6-6-6" />
          </svg>


        } />
      </div>
    </div>
  );
};

export default CarCollection;
