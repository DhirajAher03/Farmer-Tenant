import React, { useState } from "react";
import { FiLogOut, FiHelpCircle, FiMail, FiPhone } from "react-icons/fi";
import { BiBookContent } from "react-icons/bi";
import { AiOutlineQuestionCircle } from "react-icons/ai";

export default function SettingsPage() {
  const [openModal, setOpenModal] = useState(null);

  const closeModal = () => setOpenModal(null);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-xl w-full p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="font-semibold text-gray-900 border-b-2 border-blue-500">
              Settings
            </button>
            <button className="text-gray-500 hover:text-gray-700">Account</button>
          </div>
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setOpenModal("help")}
          >
            <FiHelpCircle size={20} /> Help
          </button>
        </div>

        {/* Profile Section */}
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">A. Prince</p>
              <p className="text-gray-500 text-sm">@aprince</p>
            </div>
          </div>
          <button
            className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={() => alert("Logged out successfully!")}
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>

        {/* Legal Section */}
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-4">Legal</h2>
          <div className="space-y-3">
            <button
              onClick={() => setOpenModal("privacy")}
              className="w-full flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              Privacy Policy <span>›</span>
            </button>
            <button
              onClick={() => setOpenModal("terms")}
              className="w-full flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              Terms & Conditions <span>›</span>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Support</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setOpenModal("email")}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              <FiMail /> Email Support <span>›</span>
            </button>
            <button
              onClick={() => setOpenModal("knowledge")}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              <BiBookContent /> Knowledge Base <span>›</span>
            </button>
            <button
              onClick={() => setOpenModal("contact")}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              <FiPhone /> Contact Us <span>›</span>
            </button>
            <button
              onClick={() => setOpenModal("faqs")}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              <AiOutlineQuestionCircle /> FAQs <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {openModal === "privacy" && "Privacy Policy"}
              {openModal === "terms" && "Terms & Conditions"}
              {openModal === "help" && "Help"}
              {openModal === "email" && "Email Support"}
              {openModal === "contact" && "Contact Us"}
              {openModal === "knowledge" && "Knowledge Base"}
              {openModal === "faqs" && "FAQs"}
            </h2>
            <p className="text-gray-600 mb-4">
              {openModal === "privacy" &&
                "Your privacy is important to us. We never share your data without consent."}
              {openModal === "terms" &&
                "By using this application, you agree to follow our terms and conditions."}
              {openModal === "help" &&
                "Need help? Contact support or check our Knowledge Base for solutions."}
              {openModal === "email" &&
                "For any issues, email us at support@example.com."}
              {openModal === "contact" &&
                "You can reach us at +91-9876543210 for urgent support."}
              {openModal === "knowledge" &&
                "Browse articles and tutorials in our Knowledge Base to learn more."}
              {openModal === "faqs" &&
                "Frequently Asked Questions: Find quick answers to common queries."}
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
