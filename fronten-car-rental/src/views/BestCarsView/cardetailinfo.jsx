import React from 'react';

export default function CarServicesInfo() {
  return (
    <div className="bg-gray  font-jakarta p-8 w-full mx-auto">
        <div className='max-w-[1150px] mx-auto'>     <h1 className="text-3xl  font-jakarta font-bold text-center mb-8">Information</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Know About Our Car services</h2>
        
        <p className="mb-4 text-sm">
          Lorem ipsum fermentum quam, sit amet cursus ante sollicitudin velen morbi consequa the 
        misis ariation posuftior orci sit amet jaculis nisan. Lorem ipsum fermentum quam, 
          sit amet cursus ante sollicitudin velen fermen morbipotion consequa the risus consequation, 
          the porttlio.
        </p>
        
        <ul className="space-y-2">
          <li className="flex items-center">
            <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
            <span>24/7 Roadside Assistance</span>
          </li>
          <li className="flex items-center">
            <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
            <span>Free Cancellation & Return</span>
          </li>
          <li className="flex items-center">
            <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
            <span>Rent Now Pay When You Arrive</span>
          </li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Additional Information</h2>
        
        <p className="mb-4 text-sm">
          Ideal for both business and leisure travel, the Toyota Camry offers a spacious interior 
          with ample legroom and advanced features designed to enhance your driving 
          experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque 
          bibendum posuere lectus et posuere. Phasellus ipsum mi, bibendum nec justo a, varius 
          placerat risus. Pellentesque quis odio arcu, lacinla sit amet ornare sed, commodo eu eros.
        </p>
        
        <div className="grid  text-center gap-2">
        <div className='flex justify-center gap-60'>          <ul className="space-y-1">
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Comfortable and Spacious</span>
            </li>
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Smooth Handling</span>
            </li>
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Efficient Performance</span>
            </li>
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Modern Technology</span>
            </li>
          </ul>
          
          <ul className="space-y-1">
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Safety and Peace of Mind</span>
            </li>
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Efficient Performance</span>
            </li>
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Stabilized Control</span>
            </li>
            <li className="flex items-center">
              <img src="../src/assets/bluetick.svg" alt="Checkmark" className="w-5 h-5 mr-2" />
              <span className="text-sm">Otomatic Mode</span>
            </li>
          </ul>
        </div>
        </div>

      </section>
      </div>
 
    </div>
  );
}