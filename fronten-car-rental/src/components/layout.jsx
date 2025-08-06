import React from 'react';
import Navbar from './navbar';  // Import Navbar component
import Footer from './footer';  // Import Footer component

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />  {/* Navbar at the top */}
      <main>{children}</main>  {/* Page-specific content goes here */}
      <Footer />  {/* Footer at the bottom */}
    </div>
  );
};

export default Layout;
