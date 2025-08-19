import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Button from "./button";
import logo from "../assets/logo.svg";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Logout handler for user
  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage
    navigate('/', { replace: true }); // Use replace to prevent going back
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className="bg-black text-white sticky top-0 w-full z-10">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto p-4">
          <Link to="/home" className="text-[20px] font-[400] flex gap-2 items-center font-poppins text-white" onClick={scrollToTop}>
            <img src={logo} alt="car rental logo" className="w-[50px] h-[50px]" />
            <span>Online Car Rental</span>
          </Link>

          {/* Center Menu (visible on lg and up) */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-5 text-[16px] font-[400] font-jakarta">
              <li><Link to="/home/best-cars" className="hover:text-Blue" onClick={scrollToTop}>Best Cars</Link></li>
              <li><Link to="/home/my-bookings" className="hover:text-Blue" onClick={scrollToTop}>Bookings</Link></li>
              <li><Link to="/home/customer-chat" className="hover:text-Blue" onClick={scrollToTop}>Messenger</Link></li>
              <li><Link to="/home/customerreviews" className="hover:text-Blue" onClick={scrollToTop}>Customer Review</Link></li>
              <li><Link to="/home/blogs" className="hover:text-Blue" onClick={scrollToTop}>Blogs</Link></li>
              <li><Link to="/home/contactus" className="hover:text-Blue" onClick={scrollToTop}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Log Out button (right on desktop) */}
          <div className="hidden lg:block">
            <Button height="43px" width="125px" title="Log Out" onClick={handleLogout} />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white lg:hidden focus:outline-none"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`${isOpen ? "block" : "hidden"
            } lg:hidden bg-black p-4 space-y-4`}
        >
          <ul className="flex flex-col space-y-4 text-[16px] font-[400] font-jakarta">
            <li><Link to="/home" className="hover:text-Blue" onClick={scrollToTop}>HOME</Link></li>
            <li><Link to="/home/best-cars" className="hover:text-Blue" onClick={scrollToTop}>BEST CARS</Link></li>
            <li><Link to="/home/blogs" className="hover:text-Blue" onClick={scrollToTop}>BLOGS</Link></li>
            <li><Link to="/home/about-us" className="hover:text-Blue" onClick={scrollToTop}>About Us</Link></li>
            <li><Link to="/home/contactus" className="hover:text-Blue" onClick={scrollToTop}>Contact Us</Link></li>
            <li><Link to="/home/bookingform" className="hover:text-Blue" onClick={scrollToTop}>Booking</Link></li>
            <li><Link to="/customer-chat" className="hover:text-Blue" onClick={scrollToTop}>Chat</Link></li>
            <li><Link to="/home/my-bookings" className="hover:text-Blue" onClick={scrollToTop}>My Bookings</Link></li>
          </ul>
        </div>
      </nav>

      {/* Chat Widget - always visible */}

    </>
  );
};

export default Navbar;