import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseCard from '../../components/card';

// Import car brand logos
import toyotaLogo from '../../assets/toyota.svg';
import bmwLogo from '../../assets/bmw.svg';
import mercedesLogo from '../../assets/mercedes.svg';
import hondaLogo from '../../assets/honda.svg';
import suzukiLogo from '../../assets/suzuki.svg';
import nissanLogo from '../../assets/nissan.svg';
import kiaLogo from '../../assets/kia.svg';
import fordLogo from '../../assets/ford.svg';
import teslaLogo from '../../assets/tesla.svg';
import hyundaiLogo from '../../assets/hyundai.svg';
import audiLogo from '../../assets/audi.svg';
import peugeotLogo from '../../assets/peugeot.svg';
import suvLogo from '../../assets/suv.svg';
import crossoverLogo from '../../assets/crossover.svg';
import  wagonLogo from '../../assets/wagon.svg';
import familyMBPLogo from '../../assets/family.svg';
import sportCoupeLogo from '../../assets/sport.svg';
import compactLogo from '../../assets/compact.svg';
import coupLogo from '../../assets/coup.svg';
import bMwLogo from '../../assets/sport.svg';
import sedanLogo from '../../assets/sedan.svg';
import limousineLogo from '../../assets/limo.svg';
import convertableLogo from '../../assets/convertible.svg';
import offroadLogo from '../../assets/offroad.svg';

const CarBrandsGrid = () => {
  const navigate = useNavigate();
  
  const carBrands = [
    { id: 1, name: 'Toyota', logo: toyotaLogo, path: '/assets/toyota.svg' },
    { id: 2, name: 'BMW', logo: bmwLogo, path: '/cars/bmw' },
    { id: 3, name: 'Mercedes-Benz', logo: mercedesLogo, path: '/cars/mercedes' },
    { id: 4, name: 'Honda', logo: hondaLogo, path: '/cars/honda' },
    { id: 5, name: 'Suzuki', logo: suzukiLogo, path: '/cars/suzuki' },
    { id: 6, name: 'Nissan', logo: nissanLogo, path: '/cars/nissan' },
    { id: 7, name: 'KIA', logo: kiaLogo, path: '/cars/chevrolet' },
    { id: 8, name: 'Ford', logo: fordLogo, path: '/cars/ford ' },
    { id: 9, name: 'Tesla', logo: teslaLogo , path: '/cars/tesla' },
    { id: 10, name: 'Hyundai', logo: hyundaiLogo, path: '/cars/hyundai' },
    { id: 11, name: 'Audi', logo: audiLogo, path: '/cars/audi' },
    { id: 12, name: 'Peugeot', logo: peugeotLogo, path: '/cars/peugeot' }
  ];
  
  const bodyType = [
    { id: 13, name: 'SUV', logo: suvLogo, path: '/assets/suv.svg' },
    { id: 14, name: 'Crossover', logo: crossoverLogo, path: '/suv/cross' },
    { id: 15, name: 'Wagon', logo: wagonLogo, path: '/cars/mercedes' },
    { id: 16, name: 'Family MPV', logo: familyMBPLogo, path: '/cars/honda' },
    { id: 17, name: 'Sport Coupe', logo: sportCoupeLogo, path: '/cars/suzuki' },
    { id: 18, name: 'Compact', logo: compactLogo, path: '/cars/nissan' },
    { id: 19, name: 'Coupe', logo: coupLogo, path: '/cars/chevrolet' },
    { id: 20, name: 'Hatchback', logo: bMwLogo, path: '/cars/ford' },
    { id: 21, name: 'Sedan', logo: sedanLogo, path: '/cars/tesla' },
    { id: 22, name: 'Limousine', logo: limousineLogo, path: '/cars/hyundai' },
    { id: 23, name: 'Convertible', logo: convertableLogo, path: '/cars/audi' },
    { id: 24, name: 'Off-Road', logo: offroadLogo, path: '/cars/peugeot' }
  ];

  const handleBrandClick = (brandName) => {
    // Convert brand name to match the exact format in the dropdown options
    const formattedBrand = brandName.replace(/-/g, ' ');
    navigate(`/home/best-cars?brand=${encodeURIComponent(formattedBrand)}`);
  };

  const handleBodyTypeClick = (bodyTypeName) => {
    navigate(`/home/best-cars?categories=${encodeURIComponent(bodyTypeName)}`);
  };
  



  return (
    <div className="flex flex-col gap-4">

    <div className= "w-full">

      {/* rent by Brands */}
      <div>rent by Brands</div>
    <div className="grid grid-cols-2 max-w-[900px]  mx-auto md:grid-cols-3 lg:grid-cols-6 gap-4">
      {carBrands.map((brand) => (
        <div 
          key={brand.id}
          onClick={() => handleBrandClick(brand.name)}
          className="cursor-pointer"
        >
          <BaseCard
            boxShadow={false}
            width='w-auto'
        height='h-auto'
        bgColor='bg-gray'
           className="rounded-lg"
          >
            <div className="flex   flex-col items-center justify-center h-full">
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="w-12 h-12 "
              />
              <p className="text-center text-sm font-medium ">{brand.name}</p>
            </div>
          </BaseCard>
        </div>
      ))}
    </div>

      {/* rent by body type */}
<div>rent by body type</div>
    <div className="grid grid-cols-2 max-w-[900px] mt-20 mx-auto md:grid-cols-3 lg:grid-cols-6 gap-4">
      {bodyType.map((brand) => (
        <div 
          key={brand.id}
          onClick={() => handleBodyTypeClick(brand.name)}
          className="cursor-pointer w-full h-full"
        >
          <BaseCard
            boxShadow={false}
             width='w-auto'
        height='h-auto'
        bgColor='bg-gray'
            className="rounded-lg "
          >
            <div className="flex   flex-col items-center justify-center h-full">
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="w-12 h-12 "
              />
              <p className="text-center text-sm font-medium ">{brand.name}</p>
            </div>
          </BaseCard>
        </div>
          ))}
    </div>


    </div>

    </div>
  );
};

export default CarBrandsGrid;