import { ArrowLeft, Printer, Save, Package } from "lucide-react";
import { FaUserPlus } from "react-icons/fa";
import { SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function OrderDetails() {
  // Form states
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cityFilter, setCityFilter] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  const [orderId, setOrderId] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [status, setStatus] = useState("Active");
  const [orderDate, setOrderDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [shirtStyle, setShirtStyle] = useState("Short Shirt");

  useEffect(() => {
    if (query.trim().length > 0 || cityFilter.trim().length > 0) {
      const matches = customers.filter((c) => {
        const matchesName = c.name.toLowerCase().includes(query.toLowerCase());
        const matchesCity = cityFilter
          ? c.city.toLowerCase().includes(cityFilter.toLowerCase())
          : true;
        return matchesName && matchesCity;
      });
      setFiltered(matches);
      setNotFound(matches.length === 0);
    } else {
      setFiltered([]);
      setNotFound(false);
    }
  }, [query, cityFilter, customers]);
  
  const fetchOrderID = async () => {
    try {
      const res = await API.get("/orders/new"); // Change the endpoint to a new one that generates order ID
      setOrderId(res.data.orderId);
    } catch (err) {
      console.error("Error fetching Order ID:", err);
    }
  };
  useEffect(() => {
    // Generate unique order ID from backend when component mounts
    fetchOrderID();

    // default current date for order date
    const today = new Date().toISOString().split("T")[0];
    setOrderDate(today);
  }, []);


  const [activeTab, setActiveTab] = useState("Shirt");

  const shirtFields = [
    {
      field: "Style",
      value: "",
      type: "select",
      options: ["Regular", "Slim Fit", "Loose"]
    },
    { field: "Height", value: "" },
    { field: "Chest", value: "" },
    { field: "Stomach", value: "" },
    { field: "Sheet", value: "" },
    { field: "Sleeves", value: "" },
    { field: "Shoulders", value: "" },
    { field: "Collar", value: "" },
  ];

  const pantFields = [
    {
      field: "Style",
      value: "",
      type: "select",
      options: ["Pleated", "Flat Front", "Regular"],
    },
    { field: "Height", value: "" },
    { field: "Waist", value: "" },
    { field: "Sheet", value: "" },
    { field: "Thigh", value: "" },
    { field: "Knee", value: "" },
    { field: "Bottom", value: "" },
    { field: "Long", value: "" }
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

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch customers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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
    setError(null);

    // Validate required fields
    if (!selectedCustomer) {
      setError("Please select a customer!");
      return;
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      setError("Due date cannot be before today!");
      return;
    }

    // Validate measurements
    if (!validateMeasurements()) {
      return;
    }

    setIsSaving(true);

    const measurementsData = {
      shirt: shirtData.map((item) => ({
        field: item.field,
        value: item.value || "0",
      })),
      pant: pantData.map((item) => ({
        field: item.field,
        value: item.value || "0",
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
        measurements: measurementsData,
      });

      if (response.data) {
        // Show success message
        alert("Order created successfully!");

        // Print receipt
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
          <html>
            <head>
              <title>Order Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .details { margin-bottom: 20px; }
                .measurements { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .section { border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; }
                .field { margin: 5px 0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Order Receipt</h1>
                <p>Order ID: ${orderId}</p>
              </div>
              <div class="details">
                <h2>Customer Details</h2>
                <p>Name: ${selectedCustomer.name}</p>
                <p>Mobile: ${selectedCustomer.mobile}</p>
                <p>City: ${selectedCustomer.city}</p>
              </div>
              <div class="details">
                <h2>Order Details</h2>
                <p>Garment Type: ${garmentType}</p>
                <p>Order Date: ${orderDate}</p>
                <p>Due Date: ${dueDate || 'Not specified'}</p>
                <p>Status: ${status}</p>
                <p>Notes: ${notes || 'No notes'}</p>
              </div>
              <div class="measurements">
                <div class="section">
                  <h2>Shirt Measurements</h2>
                  <p>Style: ${shirtStyle}</p>
                  ${shirtData.map(item =>
          `<div class="field">${item.field}: ${item.value || '0'}</div>`
        ).join('')}
                </div>
                <div class="section">
                  <h2>Pant Measurements</h2>
                  ${pantData.map(item =>
          `<div class="field">${item.field}: ${item.value || '0'}</div>`
        ).join('')}
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();

        // Reset form
        resetForm();

        // Generate new order ID for next order
        fetchOrderID();
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  // Measurement handling functions have been moved up

  // handleSave is now integrated into handleSubmit
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/customers", newCustomer);
      setCustomers([...customers, res.data]);
      setIsAddModalOpen(false);
      setNewCustomer({ name: "", mobile: "", city: "", DOB: "" });
      // Select the newly added customer
      setSelectedCustomer(res.data);
      setQuery(res.data.name);
    } catch (error) {
      console.error("Error adding customer:", error);
      setError("Failed to add customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setGarmentType("");
    setNotes("");
    setDueDate("");
    setSelectedCustomer(null);
    setQuery("");
    setCityFilter("");
    setShirtData(shirtFields);
    setPantData(pantFields);
    setError(null);
    setShirtStyle("Short Shirt");
    setIsSaving(false);
  };

  // Validate measurements
  const validateMeasurements = () => {
    const activeMeasurements = garmentType.toLowerCase().includes('pant') ? pantData
      : garmentType.toLowerCase().includes('shirt') ? shirtData
        : [...shirtData, ...pantData];s
    return true;
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
              {/* Two Column Layout for Measurements */}
              <div className="grid grid-cols-2 gap-6">
                {/* Shirt Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Shirt Measurements</h3>

                  {/* Shirt Style Select */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Style:</label>
                    <select
                      value={shirtData[0].value}
                      onChange={(e) => handleChange("Shirt", 0, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select Style</option>
                      {shirtFields[0].options.map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    {shirtData.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        <label className="text-sm font-medium text-gray-600 flex items-center">
                          {row.field}
                        </label>
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleChange("Shirt", idx, e.target.value)}
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pant Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Pant Measurements</h3>

                  {/* Pant Style Radio Buttons */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Style:</label>
                    <div className="flex space-x-4">
                      {['Pleated', 'Formal'].map((style) => (
                        <label key={style} className="flex items-center">
                          <input
                            type="radio"
                            name="pantStyle"
                            value={style}
                            onChange={(e) => handleChange("Pant", 0, e.target.value)}
                            checked={pantData[0].value === style}
                            className="mr-2"
                          />
                          <span className="text-sm">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pantData.slice(1).map((row, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        <label className="text-sm font-medium text-gray-600 flex items-center">
                          {row.field}
                        </label>
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleChange("Pant", idx + 1, e.target.value)}
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Save Button Section */}
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
      <input
        type="text"
        placeholder="Enter Full City Name to search"
        className="px-3 py-1 border rounded-xl text-sm"
        value={cityFilter}
        onChange={(e) => setCityFilter(e.target.value)}
      />


      {/* Add Customer Modal */}
      {
        isAddModalOpen && (
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
        )
      }
    </>
  );
}
