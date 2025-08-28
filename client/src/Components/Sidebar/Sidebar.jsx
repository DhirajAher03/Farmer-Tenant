import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsGridFill } from "react-icons/bs";
import { FaUserFriends, FaRuler } from "react-icons/fa";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { TbMessage, TbReport } from "react-icons/tb";
import { FiSettings, FiLogOut } from "react-icons/fi"; // ✅ Logout icon

import prince from "../../assets/princelogo.png";
import profilePic from "../../assets/princelogo.png";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setShow(false);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/login"; // force redirect
  };

  // Menu items config
  const menuItems = [
    {
      to: "/layout/dashboard",
      label: "Dashboard",
      icon: <BsGridFill className="mr-3 text-lg" />,
    },
    {
      to: "/layout/customers",
      label: "Customers",
      icon: <FaUserFriends className="mr-3 text-lg" />,
    },
    {
      to: "/layout/orders",
      label: "Measurements",
      icon: <FaRuler className="mr-3 text-lg" />,
    },
    {
      to: "/layout/measurements",
      label: "Orders",
      icon: <AiOutlineShoppingCart className="mr-3 text-lg" />,
    },

    {
      to: "/layout/messaging",
      label: "Messaging",
      icon: <TbMessage className="mr-3 text-lg" />,
    },
    {
      to: "/layout/reports",
      label: "Reports",
      icon: <TbReport className="mr-3 text-lg" />,
    },
    {
      to: "/layout/settings",
      label: "Settings",
      icon: <FiSettings className="mr-3 text-lg" />,
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex flex-col items-start mb-6 px-6 pt-6">
        <div className="flex items-center gap-2">
          <img src={prince} alt="Logo" className="w-10 h-10 rounded-lg" />
          <h5 className="font-bold text-gray-800 text-lg">Prince Tailor</h5>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <AiOutlineSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 flex-grow px-2">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to === "/dashboard" && location.pathname === "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={`flex items-center px-4 py-2 font-medium rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 mt-2 font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
        >
          <FiLogOut className="mr-3 text-lg" /> Logout
        </button>
      </nav>

      {/* Profile Bottom */}
      <div className="border-t mt-4 p-4 flex items-center gap-3">
        <img src={profilePic} alt="Admin" className="w-10 h-10 rounded-full" />
        <span className="font-semibold text-gray-800">Admin User</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b flex items-center justify-between px-4 py-3 shadow">
        <div className="flex items-center gap-2">
          <img src={prince} alt="Logo" className="w-8 h-8 rounded-lg" />
          <h5 className="font-bold text-gray-800 text-base">Prince Tailor</h5>
        </div>
        <button
          className="bg-blue-600 text-white p-2 rounded-lg shadow"
          onClick={() => setShow(true)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          show ? "block" : "hidden"
        } bg-black bg-opacity-40`}
        onClick={closeSidebar}
      >
        <div
          className="w-64 bg-white h-full shadow-lg p-4 pt-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="text-gray-600 mb-4" onClick={closeSidebar}>
            ✕
          </button>
          {renderSidebarContent()}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col justify-between w-64 bg-white border-r h-screen">
        {renderSidebarContent()}
      </div>
    </>
  );
};

export default Sidebar;
