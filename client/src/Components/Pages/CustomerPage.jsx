import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";

const CustomersPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: "#C-1402",
    name: "John Mathews",
    mobile: "+1 555 210",
    city: "New York",
    address: "221B Baker Street",
    lastOrder: "2025-08-12",
  });

  const customers = [
    {
      id: "#C-1402",
      name: "John Mathews",
      mobile: "+1 555 210",
      city: "john@email.com",
    },
    {
      id: "#C-1403",
      name: "Sara Ali",
      mobile: "+971 55 201",
      city: "Dubai, UAE",
    },
    {
      id: "#C-1404",
      name: "Ahmed Khan",
      mobile: "+92 300 112",
      city: "Karachi",
    },
    {
      id: "#C-1405",
      name: "Mary Jones",
      mobile: "+44 7700 900",
      city: "London, UK",
    },
  ];

  const handleView = (customer) => {
    setSelectedCustomer({
      id: customer.id,
      name: customer.name,
      mobile: customer.mobile,
      city: customer.city,
      address: "221B Baker Street",
      lastOrder: "2025-08-12",
    });
  };

  return (
    <div className="w-full min-h-screen p-6" style={{ backgroundColor: "#f5f9ff" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Customers <span className="text-gray-400 text-base">Manage</span>
        </h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow-sm text-gray-700 hover:bg-gray-100">
            <AiOutlineExport /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700">
            <FaUserPlus /> Add Customer
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        {/* Search and Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3 items-center">

            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              Customer Directory
            </h3>

          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">All</button>
            <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm">VIP</button>
            <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm">Recent</button>
          </div>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Customer Directory */}
          <div className="col-span-2 bg-white rounded-xl  p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3 items-center ">
                <div className="flex items-center border rounded-xl px-4 py-2 text-gray-500 bg-white shadow-sm w-64">
                  <FiSearch className="mr-2" />
                  <input
                    type="text"
                    placeholder="Search customers"
                    className="outline-none text-sm w-full"
                  />
                </div>
                <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-xl text-sm">
                  <FiFilter /> Filters
                </button>
                <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-xl text-sm">
                  <HiOutlineLocationMarker /> City
                </button>
              </div>
            </div>
          <table className="w-full text-sm border-separate border-spacing-0 rounded-xl overflow-hidden border-2 border-gray-100">
  <thead>
    <tr className="bg-white text-gray-600">
      <th className="text-left py-3 px-3">Customer ID</th>
      <th className="text-left py-3 px-3">Name</th>
      <th className="text-left py-3 px-3">Mobile</th>
      <th className="text-left py-3 px-3">City</th>
      <th className="text-left py-3 px-3">Actions</th>
    </tr>
  </thead>
  <tbody>
    {customers.map((customer, index) => (
      <tr
        key={index}
        className="bg-[#f5f9ff] hover:bg-blue-100"
      >
        <td className="py-3 px-3">{customer.id}</td>
        <td className="px-3">{customer.name}</td>
        <td className="px-3">{customer.mobile}</td>
        <td className="px-3">{customer.city}</td>
        <td className="px-3">
          <button
            onClick={() => handleView(customer)}
            className="px-3 py-1 bg-white rounded-lg mr-2 hover:bg-gray-200"
          >
            View
          </button>
          <button className="px-3 py-1 bg-white rounded-lg hover:bg-gray-200">
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>

          {/* Right - Customer Details */}
          <div className="bg-[#f5f9ff] rounded-xl border p-4">
            <h3 className="font-semibold mb-2">Customer Details</h3>
            <p className="text-sm text-gray-400 mb-4">Selected: {selectedCustomer.id}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <input
                  type="text"
                  value={selectedCustomer.name}
                  className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Mobile</label>
                <input
                  type="text"
                  value={selectedCustomer.mobile}
                  className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
                  readOnly
                />
              </div>

               <div>
                <label className="text-sm text-gray-500">Last Order</label>
                <input
                  type="text"
                  value={selectedCustomer.lastOrder}
                  className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">City</label>
                <input
                  type="text"
                  value={selectedCustomer.city}
                  className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
                  readOnly
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500">Address</label>
                <input
                  type="text"
                  value={selectedCustomer.address}
                  className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
                  readOnly
                />
              </div>
             
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2  bg-white rounded-xl text-sm hover:bg-gray-200">
                View Orders
              </button>
              <button className="flex-1 px-3 py-2  bg-white rounded-xl text-sm hover:bg-gray-200">
                Measurements
              </button>
            </div>
            <div className="mt-2">
              <button className="w-full px-3 py-2 bg-white rounded-xl text-sm hover:bg-gray-200">
                Message
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded-xl text-sm hover:bg-gray-300">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
