import { ArrowLeft, Printer, Save, Package } from "lucide-react";
import MeasurementEntry from "./MeasurementEntry";

export default function OrderDetails() {
  return (
    <div className="bg-[#f5f9ff] min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Left Section */}
        <div className="flex items-center space-x-2 text-[15px]">
          <span className="text-gray-600 font-medium">Order • Measurements</span>
         
        </div>

        {/* Right Buttons */}
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 rounded-lg border px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
            <ArrowLeft size={16} />
            <span>Back to Order</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg border px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
            <Printer size={16} />
            <span>Print Worksheet</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 shadow-sm">
            <Save size={16} />
            <span>Save All</span>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="shadow-sm border rounded-xl bg-white">
        <div className="p-5">
          {/* Header Row */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-800 font-medium flex items-center space-x-2">
              <Package size={18} className="text-gray-700" />
              <span>Order Details</span>
            </h2>
            {/* <span className="text-blue-600 text-sm font-medium border border-blue-200 bg-blue-50 px-3 py-1 rounded-full">
             
            </span> */}
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Order ID</label>
              <input
                type="text"
                value="O-3021"
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm h-[38px]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Garment Type</label>
              <input
                type="text"
                value="Two-piece Suit"
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm h-[38px]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Style</label>
              <input
                type="text"
                value="Classic Notch Lapel"
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm h-[38px]"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-500">Due Date</label>
              <input
                type="text"
                value="2025-09-05"
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm h-[38px]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Notes</label>
              <textarea
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm h-[38px]"
              />
            </div>
          </div>
        </div>
      </div>
      <MeasurementEntry/>
    </div>
  );
}
