import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeadingTitle from '../../components/heading'; 
import Button from '../../components/button';
import { Gauge, Cog, Users, Battery } from 'lucide-react';
import BaseCard from '../../components/card';

const bodyTypes = [
  { id: 'sports', name: 'Sports Car' },
  { id: 'offroad', name: 'Off-Road' },
  { id: 'family', name: 'Family MPV' },
  { id: 'bmw', name: 'BMW' },
  { id: 'honda', name: 'Honda' },
  { id: 'suv', name: 'SUV' }


];

const CarCollection = () => {
  const navigate = useNavigate();
const [selectedBodyType, setSelectedBodyType] = useState(bodyTypes[0].id);  const [loading, setLoading] = useState(true);
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

 const filteredCars = cars.filter(
  (car) => car.bodyType?.toLowerCase() === selectedBodyType.toLowerCase()
);
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

      <div className="flex flex-col md:flex-row gap-4 mt-10 flex-wrap justify-center">
        {filteredCars.slice(0, 6).map((car) => (
          <BaseCard width='w-[380px]' padding='p-[8px]' height='h-full' key={car.id} >
              <img 
                src={car.coverImage || car.image || '/default-car.jpg'} 
                alt={car.name} 
                className="w-full h-full rounded-[15px] object-cover" 
              />
            <div className="p-4 ">
              <div className='py-3'>
              <h3 className="text-[20px] font-[600] text-black font-jakarta">{car.name}</h3>
              <div className="mt-1 flex mb-3 items-end">
                <span className="text-[28px] font-bold">${car.dailyRate || car.price?.toFixed(2) || 'N/A'}</span>
                <span className="text-[18px] ml-1">/day</span>
              </div>
              {car.year && <p className="text-gray-600">{car.year}</p>}
              </div>
              <BaseCard bgColor='bg-gray' className='flex flex-row px-6 justify-between' boxShadow={false} width='w-300px' height='h-auto'>
                <div className="flex flex-col items-center justify-center">
                  <Gauge size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.engine || car.specs?.engine || 'N/A'}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Cog size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.transmission || car.specs?.transmission || 'N/A'}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Users size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.seats || car.specs?.seats || 'N/A'}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Battery size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.fuelType || car.specs?.type || 'N/A'}</span>
                </div>
                
              </BaseCard>
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


        }/>
      </div>
    </div>
  );
};

export default CarCollection;
