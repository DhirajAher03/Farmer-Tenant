import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiTrash2 } from "react-icons/fi";
import { AiOutlineExport } from "react-icons/ai";
import API from "../../api/axios.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

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
      const deletedCustomer = customers.find((c) => c._id === id);
      await API.delete(`/customers/${id}`);
      setCustomers(customers.filter((c) => c._id !== id));

      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer(null);
      }

      await API.post("/activities", {
        message: `Customer deleted: ${deletedCustomer?.name || "Unknown"}`,
      });
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
      ? c.orderDate && new Date(c.orderDate).toISOString().split("T")[0] === dateFilter
      : true;
    return matchesSearch && matchesCity && matchesDate;
  });

  // ✅ Export as Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCustomers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers.xlsx");
  };

  // ✅ Export as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer List", 14, 10);
    const tableData = filteredCustomers.map((c, index) => [
      index + 1,
      c.name,
      c.mobile,
      c.city,
      c.orderDate ? new Date(c.orderDate).toLocaleDateString("en-GB") : "",
    ]);

    autoTable(doc, {
      head: [["#", "Name", "Mobile", "City", "Order Date"]],
      body: tableData,
      startY: 20,
      theme: "striped",
      styles: { fontSize: 10 },
    });

    doc.save("customers.pdf");
  };

  return (
    <div className="w-full min-h-screen p-6" style={{ backgroundColor: "#f5f9ff" }}>
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Customers <span className="text-gray-400 text-base">Orders</span>
        </h2>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            <AiOutlineExport /> Export
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40 z-50">
              <button
                onClick={exportToPDF}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Export as PDF
              </button>
              <button
                onClick={exportToExcel}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Export as Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Table with Filters Inside */}
      <div className="bg-white rounded-xl p-4">
        {/* Filters inside table border */}
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
            placeholder="Enter Full City Name to search"
            className="px-3 py-1 border rounded-xl text-sm"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
          {/* <input
            type="date"
            className="px-3 py-1 border rounded-xl text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          /> */}
        </div>

        {/* ✅ Full Width Table */}
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
              <React.Fragment key={customer._id}>
                <tr className="bg-[#f5f9ff] hover:bg-blue-100">
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

                {/* ✅ Accordion Row */}
                {selectedCustomer?._id === customer._id && (
                  <tr>
                    <td colSpan="6" className="bg-gray-50 p-4">
                      <div className="border rounded-xl p-4 bg-white max-w-[400px] mx-auto">
                        {/* Tabs */}
                        <div className="flex gap-3 mb-4">
                          {["orders", "measurements", "messages"].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-3 py-1 rounded-lg text-sm ${activeTab === tab
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100"
                                }`}
                            >
                              {tab === "orders"
                                ? "Order History"
                                : tab === "measurements"
                                  ? "Measurements"
                                  : "Messages"}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <div>
                          {activeTab === "orders" && (
                            <div className="grid grid-cols-1 gap-4">
                              {["name", "mobile", "city", "orderDate"].map((field) => (
                                <div key={field}>
                                  <label className="text-sm text-gray-500 capitalize">
                                    {field}
                                  </label>
                                  <input
                                    type={field === "orderDate" ? "date" : "text"}
                                    value={
                                      field === "orderDate"
                                        ? selectedCustomer.orderDate
                                          ? new Date(selectedCustomer.orderDate)
                                            .toISOString()
                                            .split("T")[0]
                                          : ""
                                        : selectedCustomer[field] || ""
                                    }
                                    readOnly
                                    className="w-full border rounded-xl px-3 py-2 text-sm bg-gray-100"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {activeTab === "measurements" && (
                            <p className="text-sm">Measurement details...</p>
                          )}
                          {activeTab === "messages" && (
                            <p className="text-sm">Customer messages...</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;
