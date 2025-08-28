import { ArrowLeft, Printer, Save, Package } from "lucide-react";
import { FaUserPlus } from "react-icons/fa";
import { SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function OrderDetails() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [orderId, setOrderId] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [status, setStatus] = useState("Active");
  const [orderDate, setOrderDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [activeTab, setActiveTab] = useState("Shirt");

  const shirtFields = [
    { field: "Height", value: "" },
    { field: "Chest", value: "" },
    { field: "Stomach", value: "" },
    { field: "Sheet", value: "" },
    { field: "Sleeves", value: "" },
    { field: "Shoulder", value: "" },
    { field: "Collar", value: "" },
  ];

  const pantFields = [
    { field: "Style", value: "", type: "select", options: ["Pleated", "Formal"] },
    { field: "Height", value: "" },
    { field: "Waist", value: "" },
    { field: "Sheet", value: "" },
    { field: "Thighs", value: "" },
    { field: "Knee", value: "" },
    { field: "Bottom", value: "" },
    { field: "Length", value: "" },
  ];

  const [shirtData, setShirtData] = useState(shirtFields);
  const [pantData, setPantData] = useState(pantFields);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mobile: "",
    city: "",
    DOB: "",
  });

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

  useEffect(() => {
    if (query.trim().length > 0) {
      const matches = customers.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(matches);
      setNotFound(matches.length === 0);
    } else {
      setFiltered([]);
      setNotFound(false);
    }
  }, [query, customers]);

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const res = await API.get("/orders/new");
        setOrderId(res.data.orderId);
      } catch (err) {
        console.error("Error fetching Order ID:", err);
      }
    };
    fetchOrderId();

    const today = new Date().toISOString().split("T")[0];
    setOrderDate(today);
  }, []);

  const handleChange = (tab, idx, val) => {
    if (tab === "Shirt") {
      const updated = [...shirtData];
      updated[idx].value = val;
      setShirtData(updated);
    } else {
      const updated = [...pantData];
      updated[idx].value = val;
      setPantData(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      alert("Please select a customer!");
      return;
    }

    if (!garmentType) {
      alert("Please enter garment type!");
      return;
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      alert("Due date cannot be before today!");
      return;
    }

    const measurementsData = {
      shirt: shirtData.map(item => ({
        field: item.field,
        value: item.value
      })),
      pant: pantData.map(item => ({
        field: item.field,
        value: item.value
      }))
    };

    try {
      const response = await API.post("/orders", {
        orderId,
        customerId: selectedCustomer._id,
        garmentType,
        status,
        orderDate,
        dueDate,
        notes,
        measurements: measurementsData
      });

      if (response.data) {
        alert("Order created successfully!");
        setGarmentType("");
        setNotes("");
        setDueDate("");
        setSelectedCustomer(null);
        setQuery("");
        setShirtData(shirtFields);
        setPantData(pantFields);
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/customers", newCustomer);
      setCustomers([...customers, res.data]);
      setIsAddModalOpen(false);
      setNewCustomer({ name: "", mobile: "", city: "", DOB: "" });
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <>
      <div className="bg-[#f5f9ff] min-h-screen p-6 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-[15px]">
            <span className="text-gray-600 font-medium">Measurements</span>
          </div>
          <div className="flex space-x-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaUserPlus /> Add Customer
            </button>
            <button className="flex items-center space-x-2 rounded-lg border px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
              <ArrowLeft size={16} />
              <span>Back to Order</span>
            </button>
            <button className="flex items-center space-x-2 rounded-lg border px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
              <Printer size={16} />
              <span>Print Worksheet</span>
            </button>
          </div>
        </div>

        {/* Search Customer */}
        <div className="w-full max-w-md">
          <label className="text-sm text-gray-500">Select Customer</label>
          <input
            type="text"
            placeholder="Search customer by name..."
            className="mt-1 w-full border rounded-xl px-3 py-2 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {filtered.length > 0 && (
            <ul className="border rounded-xl mt-2 bg-white shadow max-h-48 overflow-y-auto">
              {filtered.map((cust) => (
                <li
                  key={cust._id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setQuery(cust.name);
                    setSelectedCustomer(cust);
                    setFiltered([]);
                  }}
                >
                  {cust.name} ({cust.mobile})
                </li>
              ))}
            </ul>
          )}
          {notFound && (
            <div className="mt-2 text-red-500 text-sm">
              User not found.{" "}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FaUserPlus /> Add Customer
              </button>
            </div>
          )}
        </div>

        {selectedCustomer && (
          <div className="mt-4 mb-4 border rounded-xl p-4 bg-gray-50">
            <h3 className="text-lg font-medium">Customer Details</h3>
            <div className="flex align-center justify-between">
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Mobile:</strong> {selectedCustomer.mobile}</p>
              <p><strong>City:</strong> {selectedCustomer.city}</p>
              <p>
                <strong>DOB:</strong>{" "}
                {selectedCustomer.DOB
                  ? new Date(selectedCustomer.DOB).toLocaleDateString("en-GB")
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="shadow-sm border rounded-xl bg-white">
          <form onSubmit={handleSubmit} className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-800 font-medium flex items-center space-x-2">
                <Package size={18} className="text-gray-700" />
                <span>Order Details</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  readOnly
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm h-[38px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Garment Type</label>
                <select
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm h-[38px]"
                  required
                >
                  <option value="">Select Garment</option>
                  <option value="Two-piece Suit">Two-piece Suit</option>
                  <option value="Three-piece Suit">Three-piece Suit</option>
                  <option value="Sherwani">Sherwani</option>
                  <option value="Kurta Pajama">Kurta Pajama</option>
                  <option value="Blazer">Blazer</option>
                  <option value="Formal Shirt">Formal Shirt</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm h-[38px]"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-500">Order Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm h-[38px]"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm h-[38px]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-500">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                rows={3}
              />
            </div>
          </form>
        </div>

        {/* Measurement Section */}
        <div className="bg-[#f5f9ff] py-6 px-4 font-sans">
          <div className="shadow-md border rounded-xl bg-white p-5">
            <div className="flex items-center border-b pb-3 mb-4">
              <SlidersHorizontal size={18} className="text-gray-700 mr-2" />
              <h2 className="text-gray-800 font-semibold text-base">
                Measurement Entry
              </h2>
            </div>

            <div>
              <div className="flex justify-center items-center space-x-2 mb-3">
                {["Shirt", "Pant"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <hr className="mb-4" />
              <div className="space-y-3">
                {(activeTab === "Shirt" ? shirtData : pantData).map(
                  (row, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2">
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        {row.field}
                      </label>
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) =>
                          handleChange(activeTab, idx, e.target.value)
                        }
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  )
                )}
              </div>
              <div className="mt-6 flex justify-center pb-6">
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md"
                >
                  <Save size={20} />
                  <span className="font-medium">Save Order</span>
                </button>
              </div>
            </div>
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
                <label className="block font-medium mb-1">
                  DOB (dd/mm/yyyy)
                </label>
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
    </>
  );
};
