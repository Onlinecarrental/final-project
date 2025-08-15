import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeadingTitle from '../../components/heading'; 
import Button from '../../components/button';
import { Gauge, Cog, Users, Battery } from 'lucide-react'; // Adjust if using another icon library
import BaseCard from '../../components/card';
import interImg from '../../assets/CARD1.jpg'
const categories = [
  { title: "Popular Car", path: "/popular-cars" },
  { title: "Luxury Car", path: "/luxury-cars" },
  { title: "Vintage Car", path: "/vintage-cars" },
  { title: "Family Car", path: "/family-cars" },
  { title: "Off-Road Car", path: "/offroad-cars" }
];

const CarCollection = () => {
  const navigate = useNavigate();

  const [cars] = useState([
    {
      id: 1,
      name: "Porsche Cayenne GTS 2022",
      price: 78.90,
      image: interImg,
      specs: {
        engine: "4,000",
        transmission: "Auto",
        seats: "4 Person",
        type: "Electric"
      }
    },
    {
      id: 2,
      name: "Porsche Cayenne GTS 2022",
      price: 78.90,
      image: interImg,
      specs: {
        engine: "4,000",
        transmission: "Auto",
        seats: "4 Person",
        type: "Electric"
      }
    },
    {
      id: 3,
      name: "Porsche Cayenne GTS 2022",
      price: 78.90,
      image: interImg,
      specs: {
        engine: "4,000",
        transmission: "Auto",
        seats: "4 Person",
        type: "Electric"
      }
    },
    {
      id: 4,
      name: "Porsche Cayenne GTS 2022",
      price: 78.90,
      image: interImg,
      specs: {
        engine: "4,000",
        transmission: "Auto",
        seats: "4 Person",
        type: "Electric"
      }
    },
    {
      id: 5,
      name: "Porsche Cayenne GTS 2022",
      price: 78.90,
      image: interImg,
      specs: {
        engine: "4,000",
        transmission: "Auto",
        seats: "4 Person",
        type: "Electric"
      }
    },{
      id: 6,
      name: "Porsche Cayenne GTS 2022",
      price: 78.90,
      image: interImg,
      specs: {
        engine: "4,000",
        transmission: "Auto",
        seats: "4 Person",
        type: "Electric"
      }
    }
  ]);

  const handleCardClick = (car) => {
    // Extract the car brand (first word of the car name)
    const brand = car.name.split(' ')[0];
    // Navigate to best-cars with search parameters
    navigate(`/home/best-cars?brand=${encodeURIComponent(brand)}`);
  };

  return (
    <div className="mt-20 py-9 bg-gray">
      <div className="max-w-[1280px] mx-auto p-6">
        <HeadingTitle 
          title="Explore Our Car Collection" 
          paragraph="Find the perfect car for any journey—from luxurious rides to rugged off-roaders." 
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-6">
        {categories.map((category) => (
          <Button 
            textColor='black'
            key={category.title}
            title={category.title} 
            bgColor="bg-white" 
            hoverBgColor="hover:bg-[#000000]"
            hoverTextColor="hover:text-white"
            width="180px"
            onClick={() => handleCardClick(category.path)}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-20   flex-wrap justify-center">
        {cars.map((car) => (
          <BaseCard 
            width='w-[380px]' 
            padding='p-[8px]' 
            height='h-full' 
            key={car.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCardClick(car)}
          >
            <div className="relative h-48 overflow-hidden">
              <img src={car.image} alt={car.name} className="w-full h-full rounded-[15px] object-cover" />
            </div>
            <div className="p-4 ">
              <div className='py-3'>
              <h3 className="text-[20px] font-[600] text-black font-jakarta">{car.name}</h3>
              <div className="mt-1 flex mb-3 items-end">
                <span className="text-[28px] font-bold">${car.price.toFixed(2)}</span>
                <span className="text-[18px] ml-1">/day</span>
              </div>
              </div>
              <BaseCard bgColor='bg-gray' className='flex flex-row px-6 justify-between' boxShadow={false} width='w-300px' height='h-auto'>
                <div className="flex flex-col items-center justify-center">
                  <Gauge size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.specs.engine}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Cog size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.specs.transmission}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Users size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.specs.seats}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Battery size={18} className="text-gray-600" />
                  <span className="text-xs mt-1">{car.specs.type}</span>
                </div>
              </BaseCard>
<div className='mt-2 ml-[5px]' >
              <Button boxShadow={false} to='/bookingform' title="Rent Now" width='320px' height='40px' />
              </div>       </div>
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
