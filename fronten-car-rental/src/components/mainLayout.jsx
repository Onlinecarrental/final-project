import React from "react";
import NavbarAgent from "./navbarAgent";
import Sidebar from "./sidebar";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <NavbarAgent />

        {/* Page Content */}
        <div className="flex-1 bg-white  p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
