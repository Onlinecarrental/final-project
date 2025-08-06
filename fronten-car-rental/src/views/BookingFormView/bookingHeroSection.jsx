import React, { useState } from 'react';
import heroImage from "../../assets/Bannerimage.jpg";

export default function HeroSectionBooking() {
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black/20">
        <div
          className="w-full h-full bg-cover opacity-30 bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
      </div>

      {/* Header Content */}
      <div className="relative z-[1px] flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl font-bold text-black mb-2">Booking Form</h1>
        <p className="text-lg text-black mb-8">
          Feel free to contact us over the email for any querry or issue.
        </p>

       
      </div>
    </div>

  );
}
