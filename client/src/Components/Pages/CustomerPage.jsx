import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiTrash2 } from "react-icons/fi";
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
    DOB: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerMeasurements, setCustomerMeasurements] = useState([]);

  const handleView = async (customer) => {
    setSelectedCustomer(customer);
    setEditData(customer);
    setIsEditing(false);
    setActiveTab("orders");

    try {
      // Fetch customer orders
      const ordersRes = await API.get(`/customers/${customer._id}/orders`);
      setCustomerOrders(ordersRes.data || []);

      // Extract measurements from the latest order
      if (ordersRes.data && ordersRes.data.length > 0) {
        const latestOrder = ordersRes.data[0]; // Assuming orders are sorted by date
        const measurements = [];

        if (latestOrder.measurements) {
          // Add shirt measurements
          if (latestOrder.measurements.shirt && Array.isArray(latestOrder.measurements.shirt)) {
            latestOrder.measurements.shirt.forEach(m => {
              // Skip empty or invalid values
              if (!m.field || !m.value) return;

              let displayField = m.field;
              if (m.field === 'Style') {
                displayField = 'Shirt Style';
              } else {
                displayField = `Shirt ${m.field}`;
              }

              measurements.push({
                field: displayField,
                value: m.value,
                unit: m.field === 'Style' || m.field === 'Notes' ? '' : 'inches',
                notes: ''
              });
            });
          }

          // Add pant measurements
          if (latestOrder.measurements.pant && Array.isArray(latestOrder.measurements.pant)) {
            latestOrder.measurements.pant.forEach(m => {
              // Skip empty or invalid values
              if (!m.field || !m.value) return;

              let displayField = m.field;
              if (m.field === 'Style') {
                displayField = 'Pant Style';
              } else {
                displayField = `Pant ${m.field}`;
              }

              measurements.push({
                field: displayField,
                value: m.value,
                unit: m.field === 'Style' || m.field === 'Notes' ? '' : 'inches',
                notes: ''
              });
            });
          }
        }

        console.log('Measurements found:', measurements); // Debug log
        setCustomerMeasurements(measurements);
      } else {
        setCustomerMeasurements([]);
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
      setCustomerOrders([]);
      setCustomerMeasurements([]);
    }
  };

  // ✅ Fetch customers on load
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

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      // 1. Add customer
      const res = await API.post("/customers", newCustomer);

      // 2. Update state
      setCustomers([...customers, res.data]);

      // 3. Add Activity Log
      await API.post("/activities", {
        message: `Customer added successfully: ${newCustomer.name}`,
      });

      // 4. Reset modal
      setIsAddModalOpen(false);
      setNewCustomer({ name: "", mobile: "", city: "", DOB: "" });
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const res = await API.put(`/customers/${editData._id}`, editData);
      setCustomers(
        customers.map((c) => (c._id === editData._id ? res.data : c))
      );
      setSelectedCustomer(res.data);
      setIsEditing(false);

      // ✅ Log Update Activity
      await API.post("/activities", {
        message: `Customer updated: ${editData.name}`,
      });
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      const deletedCustomer = customers.find((c) => c._id === id);
      await API.delete(`/customers/${id}`);
      setCustomers(customers.filter((c) => c._id !== id));
      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer(null);
      }

      // ✅ Log Delete Activity
      await API.post("/activities", {
        message: `Customer deleted: ${deletedCustomer?.name || "Unknown"}`,
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // ✅ Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile.includes(searchQuery);
    const matchesCity = cityFilter ? c.city === cityFilter : true;
    const matchesDate = dateFilter
      ? c.DOB &&
      new Date(c.DOB).toISOString().split("T")[0] === dateFilter
      : true;
    return matchesSearch && matchesCity && matchesDate;
  });

  return (
    <div
      className="w-full min-h-screen p-6"
      style={{ backgroundColor: "#f5f9ff" }}
    >
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

      {/* ✅ Main Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        {/* Search & Filters */}
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

        {/* ✅ Customer Table */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl p-4">
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
                  <tr
                    key={customer._id}
                    className="bg-[#f5f9ff] hover:bg-blue-100"
                  >
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

          {/* ✅ Right Panel - Customer Details */}
          <div className="bg-[#f5f9ff] rounded-xl border p-4 flex flex-col justify-between">
            {selectedCustomer ? (
              <>
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    Selected: {selectedCustomer.name}
                  </p>

                  {["orders", "measurements", "messages"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-sm mb-2 w-full text-left ${activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
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
                      <div>
                        <h4 className="font-semibold mb-2">Orders</h4>
                        {customerOrders.length > 0 ? (
                          <ul className="space-y-2">
                            {customerOrders.map((order) => (
                              <li
                                key={order._id}
                                className="p-2 border rounded bg-white"
                              >
                                <p>
                                  <strong>Order ID:</strong> {order.orderId}
                                </p>
                                <p>
                                  <strong>Garment:</strong> {order.garmentType}
                                </p>
                                <p>
                                  <strong>Status:</strong> {order.status}
                                </p>
                                <p>
                                  <strong>Due Date:</strong>{" "}
                                  {new Date(order.dueDate).toLocaleDateString()}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No orders found.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === "measurements" && (
                      <div>
                        <h4 className="font-semibold mb-2">Measurements</h4>
                        {customerMeasurements.length > 0 ? (
                          <div className="space-y-4">
                            {/* Shirt Measurements */}
                            <div>
                              <h5 className="font-medium text-blue-600 mb-2">Shirt Measurements</h5>
                              <table className="w-full text-sm border bg-white">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="px-2 py-1 border text-left">Measurement</th>
                                    <th className="px-2 py-1 border text-left">Value</th>
                                    <th className="px-2 py-1 border text-left">Unit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {customerMeasurements
                                    .filter(m => m.field.startsWith('Shirt'))
                                    .map((m, idx) => (
                                      <tr key={idx}>
                                        <td className="border px-2 py-1">
                                          {m.field.replace('Shirt ', '')}
                                        </td>
                                        <td className="border px-2 py-1">
                                          {m.value}
                                        </td>
                                        <td className="border px-2 py-1">{m.unit}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Pant Measurements */}
                            <div>
                              <h5 className="font-medium text-blue-600 mb-2">Pant Measurements</h5>
                              <table className="w-full text-sm border bg-white">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="px-2 py-1 border text-left">Measurement</th>
                                    <th className="px-2 py-1 border text-left">Value</th>
                                    <th className="px-2 py-1 border text-left">Unit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {customerMeasurements
                                    .filter(m => m.field.startsWith('Pant'))
                                    .map((m, idx) => (
                                      <tr key={idx}>
                                        <td className="border px-2 py-1">
                                          {m.field.replace('Pant ', '')}
                                        </td>
                                        <td className="border px-2 py-1">
                                          {m.value}
                                        </td>
                                        <td className="border px-2 py-1">{m.unit}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No measurements found.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === "messages" && (
                      <p className="text-sm text-gray-500">
                        Customer messages...
                      </p>
                    )}
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
              <p className="text-gray-400 text-sm">
                Select a customer to view details
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Add Customer Modal */}
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
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Mobile</label>
                <input
                  type="text"
                  value={newCustomer.mobile}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, mobile: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">City</label>
                <input
                  type="text"
                  value={newCustomer.city}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, city: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">DOB:</label>
                <input
                  type="date"
                  value={newCustomer.DOB}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      DOB: e.target.value,
                    })
                  }
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
