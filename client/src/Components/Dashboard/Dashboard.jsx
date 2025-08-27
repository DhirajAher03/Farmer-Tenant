import React, { useState, useEffect } from "react";
import { FiUsers, FiClipboard, FiCheckCircle, FiClock } from "react-icons/fi";
import { AiOutlineBell } from "react-icons/ai";
import { MdMessage } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { FaRuler } from "react-icons/fa";
import API from "../../api/axios.js"; // ✅ Your Axios instance
import { useNavigate } from "react-router-dom"; // ✅ For navigation

const Dashboard = () => {
  const [customersCount, setCustomersCount] = useState(0);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate(); // ✅ For navigation

  useEffect(() => {
    fetchCustomersCount();
    fetchRecentActivity();
  }, []);

  // ✅ Fetch Customers Count
  const fetchCustomersCount = async () => {
    try {
      const res = await API.get("/customers");
      setCustomersCount(res.data.length);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // ✅ Fetch Recent Activities
  const fetchRecentActivity = async () => {
    try {
      const res = await API.get("/activities"); // ✅ Assume API endpoint exists
      setActivities(res.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove JWT token
    sessionStorage.clear(); // ✅ Clear session if used
    navigate("/login"); // ✅ Redirect to login page
  };

  // ✅ Add Customer (Local update)
  const handleAddCustomer = () => {
    const newCustomerId = customersCount + 1;
    setCustomersCount(newCustomerId);

    const newActivity = {
      message: `✅ Customer Added: Customer ${newCustomerId} (ID: ${newCustomerId})`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setActivities((prev) => [newActivity, ...prev].slice(0, 3));
  };

  // ✅ Navigate to Measurement Page
  const handleNewMeasurement = () => {
    navigate("/layout/measurements");
  };

  // ✅ Navigate to Messages Page
  const handleSendMessage = () => {
    navigate("/messages");
  };

  // ✅ Navigate to Reports Page
  const handleViewReports = () => {
    navigate("/reports");
  };

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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
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
          <h2 className="text-2xl font-bold">{customersCount}</h2>
          <p className="text-xs text-gray-500">+ New customers this week</p>
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
        </div>

        <ul className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-[#f5f9ff] p-3 rounded-lg"
              >
                <span className="text-gray-700">{activity.message}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No recent activity</p>
          )}
        </ul>
      </div>

      {/* ✅ Quick Actions */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddCustomer}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiUsers /> Add Customer
          </button>
          <button
            onClick={handleNewMeasurement}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <FaRuler /> New Measurement
          </button>
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <MdMessage /> Send Message
          </button>
          <button
            onClick={handleViewReports}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <TbReportAnalytics /> View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
