import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiEdit, FiTrash2 } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";
import API from "../../api/axios.js"; // ✅ Axios instance

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [editData, setEditData] = useState({});
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mobile: "",
    city: "",
    orderDate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch customers on load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setEditData(customer);
    setIsEditing(false);
    setActiveTab("orders");
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/customers", newCustomer);
      setCustomers([...customers, res.data]);
      setIsAddModalOpen(false);
      setNewCustomer({ name: "", mobile: "", city: "", orderDate: "" });
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const res = await API.put(`/customers/${editData._id}`, editData);
      setCustomers(customers.map((c) => (c._id === editData._id ? res.data : c)));
      setSelectedCustomer(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await API.delete(`/customers/${id}`);
      setCustomers(customers.filter((c) => c._id !== id));
      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile.includes(searchQuery);
    const matchesCity = cityFilter ? c.city === cityFilter : true;
    const matchesDate = dateFilter
      ? c.orderDate && new Date(c.orderDate).toISOString().split("T")[0] === dateFilter
      : true;
    return matchesSearch && matchesCity && matchesDate;
  });

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
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaUserPlus /> Add Customer
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        {/* Tabs */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            Customer Directory
          </h3>
          {/* Tabs / Refresh */}
          <div className="flex justify-end mb-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              <AiOutlineExport /> Refresh
            </button>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left - Customer Table */}
          <div className="col-span-2 bg-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3 items-center">
                <div className="flex items-center border rounded-xl px-4 py-2 text-gray-500 bg-white shadow-sm w-64">
                  <FiSearch className="mr-2" />
                  <input
                    type="text"
                    placeholder="Search customers"
                    className="outline-none text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-xl text-sm">
                  <FiFilter /> Filters
                </button>
                <input
                  type="text"
                  placeholder="City"
                  className="px-3 py-1 border rounded-xl text-sm"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
                <input
                  type="date"
                  className="px-3 py-1 border rounded-xl text-sm"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            <table className="w-full text-sm border-separate border-spacing-0 rounded-xl overflow-hidden border-2 border-gray-100">
              <thead>
                <tr className="bg-white text-gray-600">
                  <th className="text-left py-3 px-3">#</th>
                  <th className="text-left py-3 px-3">Name</th>
                  <th className="text-left py-3 px-3">Mobile</th>
                  <th className="text-left py-3 px-3">City</th>
                  <th className="text-left py-3 px-3">Order Date</th>
                  <th className="text-left py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer._id} className="bg-[#f5f9ff] hover:bg-blue-100">
                    <td className="py-3 px-3">{index + 1}</td>
                    <td className="px-3">{customer.name}</td>
                    <td className="px-3">{customer.mobile}</td>
                    <td className="px-3">{customer.city}</td>
                    <td className="px-3">
                      {customer.orderDate
                        ? new Date(customer.orderDate).toLocaleDateString("en-GB")
                        : ""}
                    </td>
                    <td className="px-3 flex gap-2">
                      <button
                        onClick={() => handleView(customer)}
                        className="flex items-center gap-1 px-3 py-1 bg-white border rounded-lg hover:bg-gray-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-white border rounded-lg hover:bg-red-100 text-red-600"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right - Customer Details */}
          <div className="bg-[#f5f9ff] rounded-xl border p-4 flex flex-col justify-between">
            {selectedCustomer ? (
              <>
                <div>
                  <p className="text-sm text-gray-400 mb-4">Selected: {selectedCustomer.name}</p>

                  {["orders", "measurements", "messages"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-sm mb-2 w-full text-left ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white border"
                        }`}
                    >
                      {tab === "orders"
                        ? "Order History"
                        : tab === "measurements"
                          ? "Measurements"
                          : "Messages"}
                    </button>
                  ))}

                  <div className="mt-4">
                    {activeTab === "orders" && (
                      <div className="grid grid-cols-2 gap-4">
                        {["name", "mobile", "city", "orderDate"].map((field) => (
                          <div key={field}>
                            <label className="text-sm text-gray-500 capitalize">{field}</label>
                            <input
                              type={field === "orderDate" ? "date" : "text"}
                              value={
                                field === "orderDate"
                                  ? editData.orderDate
                                    ? new Date(editData.orderDate)
                                      .toISOString()
                                      .split("T")[0]
                                    : ""
                                  : editData[field] || ""
                              }
                              onChange={(e) =>
                                setEditData({ ...editData, [field]: e.target.value })
                              }
                              readOnly={!isEditing}
                              className={`w-full border rounded-xl px-3 py-2 text-sm ${isEditing ? "bg-white" : "bg-gray-100"
                                }`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === "measurements" && <p className="text-sm">Measurement details...</p>}
                    {activeTab === "messages" && <p className="text-sm">Customer messages...</p>}
                  </div>
                </div>

                <div className="mt-4">
                  {isEditing ? (
                    <button
                      onClick={handleSaveChanges}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Select a customer to view details</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Add Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Mobile</label>
                <input
                  type="text"
                  value={newCustomer.mobile}
                  onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">City</label>
                <input
                  type="text"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Order Date</label>
                <input
                  type="date"
                  value={newCustomer.orderDate}
                  onChange={(e) => setNewCustomer({ ...newCustomer, orderDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
