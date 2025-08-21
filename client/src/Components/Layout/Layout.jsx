import React from "react";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar (Desktop Fixed) */}
      <div className="fixed top-0 left-0 h-screen bg-white shadow-lg z-40">
        <Sidebar />
      </div>

      {/* Right Side Content */}
      <main className="flex-1 md:ml-64 p-4 mt-12 md:mt-0">
        {/* mt-12 => mobile pe top navbar ke neeche se content start hoga */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
