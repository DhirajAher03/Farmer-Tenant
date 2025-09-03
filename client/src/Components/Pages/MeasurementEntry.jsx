import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import API from "../../api/axios.js";

const OrderPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await API.get("/orders/all");
      const ordersWithCustomers = await Promise.all(
        response.data.map(async (order) => {
          try {
            // ✅ Agar backend populate karke customer object bhej raha hai
            if (order.customerId && typeof order.customerId === "object") {
              return { ...order, customerName: order.customerId.name };
            }

            // ✅ Agar sirf customerId string aa raha hai
            if (order.customerId) {
              const customerRes = await API.get(`/customers/${order.customerId}`);
              return { ...order, customerName: customerRes.data.name };
            }

            return { ...order, customerName: "Unknown Customer" };
          } catch (customerError) {
            console.warn(`Error fetching customer for order ${order._id}:`, customerError);
            return { ...order, customerName: "Unknown Customer" };
          }
        })
      );
      setOrders(ordersWithCustomers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = cityFilter
      ? order.status.toLowerCase() === cityFilter.toLowerCase()
      : true;
    const matchesDate = dateFilter
      ? order.orderDate &&
        new Date(order.orderDate).toISOString().split("T")[0] === dateFilter
      : true;
    return matchesSearch && matchesStatus && matchesDate;
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
            placeholder="Search by Order ID or Customer"
            className="outline-none text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-1 border rounded-xl text-sm"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
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
            <th className="text-left py-3 px-3">Order ID</th>
            <th className="text-left py-3 px-3">Customer Name</th>
            <th className="text-left py-3 px-3">Status</th>
            <th className="text-left py-3 px-3">Order Date</th>
            <th className="text-left py-3 px-3">Due Date</th>
            <th className="text-left py-3 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <React.Fragment key={order._id}>
              <tr className="bg-[#f5f9ff] hover:bg-blue-100">
                <td className="py-3 px-3">{index + 1}</td>
                <td className="px-3">{order.orderId}</td>
                <td className="px-3">{order.customerName}</td>
                <td className="px-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Active"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-3">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-3">
                  {order.dueDate
                    ? new Date(order.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-3 flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?._id === order._id ? null : order
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1 bg-white border rounded-lg hover:bg-gray-100"
                  >
                    {selectedOrder?._id === order._id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>

              {/* ✅ Accordion for Details */}
              {selectedOrder?._id === order._id && (
                <tr>
                  <td colSpan="7" className="bg-gray-50 p-4">
                    <div className="border rounded-xl p-4 bg-white w-full">
                      {/* ✅ Tabs */}
                      <div className="flex gap-3 mb-4">
                        {["orders", "messages"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {tab === "orders" ? "Order Details" : "Messages"}
                          </button>
                        ))}
                      </div>

                      {/* ✅ Tab Content */}
                      {activeTab === "orders" && (
                        <div className="space-y-6">
                          {/* Order Details Section */}
                          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <label className="text-gray-500 text-sm block">
                                Order ID
                              </label>
                              <span className="text-sm font-medium">
                                {selectedOrder.orderId}
                              </span>
                            </div>
                            <div>
                              <label className="text-gray-500 text-sm block">
                                Garment Type
                              </label>
                              <span className="text-sm font-medium">
                                {selectedOrder.garmentType}
                              </span>
                            </div>
                            <div>
                              <label className="text-gray-500 text-sm block">
                                Order Date
                              </label>
                              <span className="text-sm font-medium">
                                {new Date(
                                  selectedOrder.orderDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <label className="text-gray-500 text-sm block">
                                Status
                              </label>
                              <span className="text-sm font-medium">
                                {selectedOrder.status}
                              </span>
                            </div>
                            {selectedOrder.dueDate && (
                              <div>
                                <label className="text-gray-500 text-sm block">
                                  Due Date
                                </label>
                                <span className="text-sm font-medium">
                                  {new Date(
                                    selectedOrder.dueDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {selectedOrder.notes && (
                              <div className="col-span-2">
                                <label className="text-gray-500 text-sm block">
                                  Notes
                                </label>
                                <p className="text-sm">{selectedOrder.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Measurements Section */}
                          {selectedOrder.measurements && (
                            <div className="grid grid-cols-2 gap-6">
                              {/* Shirt Measurements */}
                              {selectedOrder.measurements.shirt && (
                                <div className="border rounded-lg p-4">
                                  <h3 className="text-lg font-medium mb-4">
                                    Shirt Measurements
                                  </h3>
                                  <div className="space-y-3">
                                    {Object.entries(
                                      selectedOrder.measurements.shirt
                                    ).map(([key, value]) => (
                                      <div
                                        key={key}
                                        className="grid grid-cols-2 gap-2"
                                      >
                                        <span className="text-sm font-medium capitalize">
                                          {key}:
                                        </span>
                                        <span className="text-sm">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Pant Measurements */}
                              {selectedOrder.measurements.pant && (
                                <div className="border rounded-lg p-4">
                                  <h3 className="text-lg font-medium mb-4">
                                    Pant Measurements
                                  </h3>
                                  <div className="space-y-3">
                                    {Object.entries(
                                      selectedOrder.measurements.pant
                                    ).map(([key, value]) => (
                                      <div
                                        key={key}
                                        className="grid grid-cols-2 gap-2"
                                      >
                                        <span className="text-sm font-medium capitalize">
                                          {key}:
                                        </span>
                                        <span className="text-sm">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
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
