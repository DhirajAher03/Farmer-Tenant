import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import API from "../../api/axios.js";
import { useOrders } from "../../context/OrderContext";

const OrderPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("orders");

  const { updateOrderCounts } = useOrders();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await API.get("/orders/all");
      const ordersWithCustomers = await Promise.all(
        response.data.map(async (order) => {
          try {
            if (order.customerId && typeof order.customerId === "object") {
              return {
                ...order,
                customerName: order.customerId.name,
                customerMobile: order.customerId.mobile
              };
            }

            if (order.customerId) {
              const customerRes = await API.get(`/customers/${order.customerId}`);
              return {
                ...order,
                customerName: customerRes.data.name,
                customerMobile: customerRes.data.mobile
              };
            }

            return { ...order, customerName: "Unknown Customer" };
          } catch (customerError) {
            console.warn(`Error fetching customer for order ${order._id}:`, customerError);
            return { ...order, customerName: "Unknown Customer" };
          }
        })
      );
      setOrders(ordersWithCustomers);
      updateOrderCounts(ordersWithCustomers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}`, { status: newStatus });
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      updateOrderCounts(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleSaveOrder = async () => {
    try {
      // Send update to backend
      const response = await API.patch(`/orders/${selectedOrder._id}`, selectedOrder);

      // Update local orders state
      const updatedOrders = orders.map(order =>
        order._id === selectedOrder._id ? { ...response.data, customerName: order.customerName } : order
      );

      setOrders(updatedOrders);
      updateOrderCounts(updatedOrders);
      setEditMode(false);

      // Show success message (you can use your preferred toast/alert library)
      alert("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await API.delete(`/orders/${orderId}`);
      const updatedOrders = orders.filter(order => order._id !== orderId);
      setOrders(updatedOrders);
      updateOrderCounts(updatedOrders);
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerMobile && order.customerMobile.includes(searchQuery));
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
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-2 py-1 rounded-lg text-xs border ${order.status === "Active"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : order.status === "Completed"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-yellow-50 text-yellow-800 border-yellow-200"
                      }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
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
                    onClick={() => {
                      setSelectedOrder(selectedOrder?._id === order._id ? null : order);
                      setEditMode(false);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-white border rounded-lg hover:bg-gray-100"
                  >
                    {selectedOrder?._id === order._id ? "Hide" : "View"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setEditMode(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100"
                  >
                    Delete
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab
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
                              {editMode ? (
                                <select
                                  value={selectedOrder.garmentType}
                                  onChange={(e) => setSelectedOrder({
                                    ...selectedOrder,
                                    garmentType: e.target.value
                                  })}
                                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1 text-sm"
                                >
                                  <option value="">Select Garment</option>
                                  <option value="Two-piece Suit">Two-piece Suit</option>
                                  <option value="Three-piece Suit">Three-piece Suit</option>
                                  <option value="Jodhpuri">Jodhpuri</option>
                                  <option value="Kurta Pajama">Kurta Pajama</option>
                                  <option value="Blazer">Blazer</option>
                                  <option value="Formal Shirt">Formal Shirt</option>
                                </select>
                              ) : (
                                <span className="text-sm font-medium">
                                  {selectedOrder.garmentType}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="text-gray-500 text-sm block">
                                Order Date
                              </label>
                              {editMode ? (
                                <input
                                  type="date"
                                  value={selectedOrder.orderDate.split('T')[0]}
                                  onChange={(e) => setSelectedOrder({
                                    ...selectedOrder,
                                    orderDate: e.target.value
                                  })}
                                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1 text-sm"
                                />
                              ) : (
                                <span className="text-sm font-medium">
                                  {new Date(selectedOrder.orderDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="text-gray-500 text-sm block">
                                Status
                              </label>
                              {editMode ? (
                                <select
                                  value={selectedOrder.status}
                                  onChange={(e) => setSelectedOrder({
                                    ...selectedOrder,
                                    status: e.target.value
                                  })}
                                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1 text-sm"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Pending">Pending</option>
                                </select>
                              ) : (
                                <span className="text-sm font-medium">
                                  {selectedOrder.status}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="text-gray-500 text-sm block">
                                Due Date
                              </label>
                              {editMode ? (
                                <input
                                  type="date"
                                  value={selectedOrder.dueDate ? selectedOrder.dueDate.split('T')[0] : ''}
                                  onChange={(e) => setSelectedOrder({
                                    ...selectedOrder,
                                    dueDate: e.target.value
                                  })}
                                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1 text-sm"
                                />
                              ) : (
                                <span className="text-sm font-medium">
                                  {selectedOrder.dueDate ? new Date(selectedOrder.dueDate).toLocaleDateString() : '-'}
                                </span>
                              )}
                            </div>
                            <div className="col-span-2">
                              <label className="text-gray-500 text-sm block">
                                Notes
                              </label>
                              {editMode ? (
                                <textarea
                                  value={selectedOrder.notes || ''}
                                  onChange={(e) => setSelectedOrder({
                                    ...selectedOrder,
                                    notes: e.target.value
                                  })}
                                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1 text-sm"
                                  rows={3}
                                />
                              ) : (
                                <p className="text-sm">{selectedOrder.notes || '-'}</p>
                              )}
                            </div>
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
                                        {editMode ? (
                                          <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                              const updatedMeasurements = {
                                                ...selectedOrder.measurements,
                                                shirt: {
                                                  ...selectedOrder.measurements.shirt,
                                                  [key]: e.target.value
                                                }
                                              };
                                              setSelectedOrder({
                                                ...selectedOrder,
                                                measurements: updatedMeasurements
                                              });
                                            }}
                                            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                                          />
                                        ) : (
                                          <span className="text-sm">{value}</span>
                                        )}
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
                                        {editMode ? (
                                          <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                              const updatedMeasurements = {
                                                ...selectedOrder.measurements,
                                                pant: {
                                                  ...selectedOrder.measurements.pant,
                                                  [key]: e.target.value
                                                }
                                              };
                                              setSelectedOrder({
                                                ...selectedOrder,
                                                measurements: updatedMeasurements
                                              });
                                            }}
                                            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                                          />
                                        ) : (
                                          <span className="text-sm">{value}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Save/Cancel Buttons */}
                          {editMode && (
                            <div className="flex justify-end gap-3 mt-6">
                              <button
                                onClick={() => {
                                  setEditMode(false);
                                  // Reset to original order data
                                  setSelectedOrder(orders.find(o => o._id === selectedOrder._id));
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveOrder}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Save Changes
                              </button>
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
