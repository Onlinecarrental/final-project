import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"

const Footer = () => {
  return (
    <footer className="bg-black text-white font-jakarta">
      <div className="max-w-[1280px] mx-auto px-4">
        
        {/* Main Section - Grid Layout */}
        <div className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Company Info Card */}
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src={logo} alt="car rental logo" className="w-[40px] h-[40px]" />
                <div>
                  <h3 className="text-lg font-bold">Online Car Rental</h3>
                  <p className="text-gray-400 text-xs">Trusted Car Rental Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                We help you find the best cars at the best prices. Fast bookings, verified reviews, and smooth communication — everything in one place.
              </p>
            </div>

            {/* Discover Card */}
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Discover</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Browse Cars</li>
                <li className="hover:text-white cursor-pointer transition-colors">Customer Reviews</li>
                <li className="hover:text-white cursor-pointer transition-colors">Travel Tips & Blogs</li>
              </ul>
            </div>

            {/* Customer Portal Card */}
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Customer Portal</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">My Messages</li>
                <li className="hover:text-white cursor-pointer transition-colors">My Bookings</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact US</li>
              </ul>
            </div>

            {/* Social Media Card */}
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex justify-center space-x-3 mb-4">
                {/* Facebook Icon */}
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                  </svg>
                </a>
                
                {/* Telegram Icon */}
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                  <span className="sr-only">Telegram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.05-.01-.14-.11-.17-.1-.03-.27.02-.38.09-.14.09-1.74 1.11-2.63 1.67-.29.18-.89.44-1.44.4-.53-.03-1.24-.33-1.85-.6-.76-.33-1.05-.53-1.02-1.14.02-.33.24-.67.61-.99.89-.77 8.07-3.49 8.55-3.59 1.41-.3 2.92-.14 3.25 1.73l-.33-.18z" />
                  </svg>
                </a>
                
                {/* Instagram Icon */}
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                
                {/* Globe/Web Icon */}
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                  <span className="sr-only">Website</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </a>
              </div>
              
              <div className="text-xs text-gray-500">
                Stay connected
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
                <span>Gulberg, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>support@Onlinecarental.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>+92 321 5251724</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <div className="mb-4 md:mb-0">
              ©2025 Online Car Rental. All Rights Reserved
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;