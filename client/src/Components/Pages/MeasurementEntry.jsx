import { Search, SlidersHorizontal, Edit, Plus, Save, Copy, PlusCircle } from "lucide-react";
import { useState } from "react";

export default function MeasurementEntry() {
  const [fields, setFields] = useState([
    { field: "Chest", value: "40", unit: "in", notes: "Snug fit" },
    { field: "Waist", value: "34", unit: "in", notes: "After lunch +0.5" },
    { field: "Hips", value: "38", unit: "in", notes: "—" },
    { field: "Shoulder", value: "18", unit: "in", notes: "Natural slope" },
    { field: "Sleeve Length", value: "24.5", unit: "in", notes: "Include cuff" },
    { field: "Jacket Length", value: "29", unit: "in", notes: "Classic length" },
  ]);

  const [orderItems, setOrderItems] = useState([
    { item: "Two-piece Suit", qty: "1" },
    { item: "Extra Pants", qty: "1" },
  ]);

  return (
    <div className="bg-[#f5f9ff] min-h-screen py-6 px-4 font-sans">
      {/* Main Container */}
      <div className="shadow-md border rounded-xl bg-white p-5">
        {/* Header */}
        <div className="flex items-center border-b pb-3 mb-4">
          <SlidersHorizontal size={18} className="text-gray-700 mr-2" />
          <h2 className="text-gray-800 font-semibold text-base">Measurement Entry</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="md:col-span-2">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-medium text-gray-600">
              <div>Field</div>
              <div>Value</div>
              <div>Unit</div>
              <div>Notes</div>
            </div>

            {/* Dynamic Rows */}
            {fields.map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                <div className="flex items-center text-sm text-gray-800">{row.field}</div>
                <input
                  type="text"
                  defaultValue={row.value}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  defaultValue={row.unit}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  defaultValue={row.notes}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            ))}

            {/* Extra Fields */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-600">Fitting Preference</label>
                <input
                  type="text"
                  defaultValue="Tailored Fit"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Posture</label>
                <input
                  type="text"
                  defaultValue="Normal"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Special Instructions</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm h-[70px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button className="flex items-center space-x-1 rounded-md border px-3 py-1.5 text-gray-700 bg-white hover:bg-gray-100 shadow-sm text-sm">
                <PlusCircle size={16} />
                <span>Add Field</span>
              </button>
              <button className="flex items-center space-x-1 rounded-md border px-3 py-1.5 text-gray-700 bg-white hover:bg-gray-100 shadow-sm text-sm">
                <Copy size={16} />
                <span>Duplicate from Shirt</span>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div>
            {/* Tabs */}
            <div className="flex items-center space-x-2 mb-3">
              {["Suits", "Shirts", "Trousers", "Others"].map((tab, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    tab === "Suits"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search & Presets */}
            <div className="flex items-center space-x-2 mb-3">
              <button className="flex items-center space-x-1 flex-1 rounded-md border px-2 py-1.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100">
                <Search size={16} />
                <span>Search fields</span>
              </button>
              <button className="flex items-center space-x-1 rounded-md border px-2 py-1.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100">
                <SlidersHorizontal size={16} />
                <span>Presets</span>
              </button>
            </div>

            {/* Items Table */}
            <div className="border rounded-md overflow-hidden text-sm">
              {orderItems.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 items-center border-b last:border-0 px-2 py-2"
                >
                  <div>{row.item}</div>
                  <input
                    type="text"
                    defaultValue={row.qty}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm w-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <button className="flex items-center space-x-1 rounded-md border px-3 py-1.5 text-gray-700 bg-white hover:bg-gray-100 shadow-sm text-sm">
                <Plus size={16} />
                <span>Add Order Line</span>
              </button>
              <button className="flex items-center space-x-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm">
                <Save size={16} />
                <span>Save Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
