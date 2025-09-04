import React from "react";
import { FaRegSadCry } from "react-icons/fa"; // Icon for unavailable service

export default function MessagingPage() {
  return (
    <div className="flex  justify-center items-center h-screen ">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        <div className="flex justify-center mb-4">
          <FaRegSadCry className="text-blue-500 text-6xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          This Service is Currently Unavailable
        </h1>
        <p className="text-gray-600">
          We’re working hard to make this service available soon. Thank you for your patience!
        </p>
      </div>
    </div>
  );
}

