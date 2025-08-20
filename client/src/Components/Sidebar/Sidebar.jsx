import { Home, Users, ClipboardList, Ruler, MessageSquare, BarChart2, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="p-4 font-bold text-lg border-b">Prince Tailor</div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-1 text-sm">
        <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
          <Home className="w-4 h-4 mr-3" /> Dashboard
        </a>
        <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
          <Users className="w-4 h-4 mr-3" /> Customers
        </a>
        <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
          <ClipboardList className="w-4 h-4 mr-3" /> Orders
        </a>
        <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
          <Ruler className="w-4 h-4 mr-3" /> Measurements
        </a>
        <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
          <MessageSquare className="w-4 h-4 mr-3" /> Messaging
        </a>
        <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
          <BarChart2 className="w-4 h-4 mr-3" /> Reports
        </a>
        <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
          <Settings className="w-4 h-4 mr-3" /> Settings
        </a>
      </nav>

      {/* Owner Info */}
      <div className="p-4 border-t flex items-center text-sm">
        <img
          src="https://via.placeholder.com/32"
          alt="owner"
          className="w-8 h-8 rounded-full mr-3"
        />
        <div>
          <p className="font-medium">A. Prince</p>
          <p className="text-gray-500 text-xs">Owner</p>
        </div>
      </div>
    </div>
  );
}
