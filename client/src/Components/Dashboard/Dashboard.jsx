import React, { useState } from "react";
import { FiUsers, FiClipboard, FiCheckCircle, FiClock } from "react-icons/fi";
import { AiOutlineBell, AiOutlinePlus } from "react-icons/ai";
import { MdMessage } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { FaRuler } from "react-icons/fa";

const Dashboard = () => {
  const [filter, setFilter] = useState("all");

  return (
    <div className="p-3 w-full bg-[#f5f9ff] min-h-screen">
      {/* ✅ Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <span className="text-sm text-gray-500">Today</span>
        </div>

        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            <AiOutlineBell /> Alerts
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <AiOutlinePlus /> New Order
          </button>
        </div>
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-500">Total Customers</h3>
            <FiUsers className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold">842</h2>
          <p className="text-xs text-gray-500">+12 this week</p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-500">Active Orders</h3>
            <FiClipboard className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold">57</h2>
          <p className="text-xs text-gray-500">12 in work</p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-500">Completed Orders</h3>
            <FiCheckCircle className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold">1,204</h2>
          <p className="text-xs text-gray-500">+8 today</p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-500">Pending Orders</h3>
            <FiClock className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold">19</h2>
          <p className="text-xs text-gray-500">4 overdue</p>
        </div>
      </div>

      {/* ✅ Recent Activity */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-lg ${filter === "all"
                ? "bg-blue-600 text-white"
                : "border text-gray-600 hover:bg-gray-100"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("orders")}
              className={`px-3 py-1 text-sm rounded-lg ${filter === "orders"
                ? "bg-blue-600 text-white"
                : "border text-gray-600 hover:bg-gray-100"
                }`}
            >
              Orders
            </button>
            <button
              onClick={() => setFilter("customers")}
              className={`px-3 py-1 text-sm rounded-lg ${filter === "customers"
                ? "bg-blue-600 text-white"
                : "border text-gray-600 hover:bg-gray-100"
                }`}
            >
              Customers
            </button>
          </div>
        </div>

        <ul className="space-y-3">
          <li className="flex justify-between items-center bg-[#f5f9ff] p-3 rounded-lg">
            <span className="text-gray-700">
              📝 Order #1082 completed for John Mathews
            </span>
            <span className="text-xs text-gray-500">2m ago</span>
          </li>
          <li className="flex justify-between items-center bg-[#f5f9ff] p-3 rounded-lg">
            <span className="text-gray-700">
              📏 Measurements updated for Sara Ali
            </span>
            <span className="text-xs text-gray-500">1h ago</span>
          </li>
          <li className="flex justify-between items-center bg-[#f5f9ff] p-3 rounded-lg">
            <span className="text-gray-700">
              📩 Sent status update to Ahmed Khan
            </span>
            <span className="text-xs text-gray-500">3h ago</span>
          </li>
        </ul>
      </div>

      {/* ✅ Quick Actions */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiUsers /> Add Customer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
            <FaRuler /> New Measurement
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
            <MdMessage /> Send Message
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
            <TbReportAnalytics /> View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
