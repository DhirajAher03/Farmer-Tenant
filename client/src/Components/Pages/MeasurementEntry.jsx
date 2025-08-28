import React, { useState, useEffect } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import API from "../../api/axios.js";

const OrderPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // ✅ Tabs inside accordion

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

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile.includes(searchQuery);
    const matchesCity = cityFilter ? c.city === cityFilter : true;
    const matchesDate = dateFilter
      ? c.orderDate &&
        new Date(c.orderDate).toISOString().split("T")[0] === dateFilter
      : true;
    return matchesSearch && matchesCity && matchesDate;
  });

  return (
    <div className="w-full min-h-screen p-6" style={{ backgroundColor: "#f5f9ff" }}>
      <h2 className="text-xl font-semibold mb-4">Customer Orders</h2>

      {/* ✅ Filters */}
      <div className="flex gap-3 mb-4">
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

      {/* ✅ Table */}
      <table className="w-full text-sm border-separate border-spacing-0 rounded-xl overflow-hidden border-2 border-gray-100">
        <thead>
          <tr className="bg-white text-gray-600">
            <th className="text-left py-3 px-3">#</th>
            <th className="text-left py-3 px-3">Name</th>
            <th className="text-left py-3 px-3">Mobile</th>
            <th className="text-left py-3 px-3">City</th>
            <th className="text-left py-3 px-3">DOB</th>
            <th className="text-left py-3 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <React.Fragment key={customer._id}>
              <tr className="bg-[#f5f9ff] hover:bg-blue-100">
                <td className="py-3 px-3">{index + 1}</td>
                <td className="px-3">{customer.name}</td>
                <td className="px-3">{customer.mobile}</td>
                <td className="px-3">{customer.city}</td>
                <td className="px-3">
                  {customer.DOB
                    ? new Date(customer.DOB).toLocaleDateString("en-GB")
                    : ""}
                </td>
                <td className="px-3 flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedCustomer(
                        selectedCustomer?._id === customer._id ? null : customer
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1 bg-white border rounded-lg hover:bg-gray-100"
                  >
                    {selectedCustomer?._id === customer._id ? "Hide" : "View"}
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-white border rounded-lg hover:bg-red-100 text-red-600"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>

              {/* ✅ Accordion for Details */}
              {selectedCustomer?._id === customer._id && (
                <tr>
                  <td colSpan="6" className="bg-gray-50 p-4">
                    <div className="border rounded-xl p-4 bg-white w-full">
                      {/* ✅ Tabs */}
                      <div className="flex gap-3 mb-4">
                        {["orders", "measurements", "messages"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {tab === "orders"
                              ? "Order Details"
                              : tab === "measurements"
                              ? "Measurements"
                              : "Messages"}
                          </button>
                        ))}
                      </div>

                      {/* ✅ Tab Content */}
                      {activeTab === "orders" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-500 text-sm">Name</label>
                            <input
                              type="text"
                              value={customer.name}
                              readOnly
                              className="w-full border rounded-xl px-3 py-2 bg-gray-100 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 text-sm">Mobile</label>
                            <input
                              type="text"
                              value={customer.mobile}
                              readOnly
                              className="w-full border rounded-xl px-3 py-2 bg-gray-100 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 text-sm">City</label>
                            <input
                              type="text"
                              value={customer.city}
                              readOnly
                              className="w-full border rounded-xl px-3 py-2 bg-gray-100 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 text-sm">Order Date</label>
                            <input
                              type="date"
                              value={
                                customer.orderDate
                                  ? new Date(customer.orderDate)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              readOnly
                              className="w-full border rounded-xl px-3 py-2 bg-gray-100 text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === "measurements" && (
                        <div>
                          <p className="text-gray-600 text-sm">
                            Measurement details will be shown here.
                          </p>
                        </div>
                      )}

                      {activeTab === "messages" && (
                        <div>
                          <p className="text-gray-600 text-sm">
                            Customer messages will appear here.
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderPage;
