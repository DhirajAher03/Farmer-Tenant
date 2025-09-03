import React, { useState, useEffect } from "react";
import { FiLogOut, FiHelpCircle, FiMail, FiPhone } from "react-icons/fi";
import { BiBookContent } from "react-icons/bi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import princelogo from "../../assets/princelogo.png";

export default function SettingsPage() {
  const [openModal, setOpenModal] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      const rememberedEmail = localStorage.getItem("rememberEmail");
      if (rememberedEmail) {
        setUserEmail(rememberedEmail);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const closeModal = () => setOpenModal(null);

  return (
    <div className="w-full min-h-screen bg-[#f5f9ff] p-6">
      <div className="bg-white shadow-md rounded-xl w-full p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="font-semibold text-gray-900 border-b-2 border-blue-500">
              Settings
            </button>
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
              src={princelogo}
              alt="Prince Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <p className="font-semibold text-gray-800">Prince Tailors</p>
              <p className="text-gray-500 text-sm">{userEmail || "No email found"}</p>
            </div>
          </div>
          <button
            className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={handleLogout}
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
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">
              {openModal === "privacy" && "Privacy Policy"}
              {openModal === "terms" && "Terms & Conditions"}
              {openModal === "help" && "Help & Support"}
              {openModal === "email" && "Email Support"}
              {openModal === "contact" && "Contact Us"}
              {openModal === "knowledge" && "Knowledge Base"}
              {openModal === "faqs" && "FAQs"}
            </h2>

            <div className="text-gray-600 mb-4 space-y-3 text-sm leading-relaxed">
              {openModal === "privacy" && (
                <>
                  <p>
                    We value your privacy and are committed to protecting your personal information.
                    This Privacy Policy outlines how we collect, use, and safeguard your data.
                  </p>
                  <p>
                    1. Information we collect: personal details like name, email, and usage data.
                  </p>
                  <p>
                    2. How we use information: improve services, provide support, and ensure security.
                  </p>
                  <p>
                    3. Data security: we implement strict measures to prevent unauthorized access.
                  </p>
                  <p>
                    4. Sharing: we never sell or rent your information. Sharing only happens with your
                    consent or legal obligation.
                  </p>
                  <p>
                    5. Cookies: our website may use cookies to enhance user experience.
                  </p>
                  <p>
                    6. User rights: you can request access, modification, or deletion of your data.
                  </p>
                  <p>
                    7. Retention: we retain data only as long as necessary for service delivery.
                  </p>
                  <p>
                    8. Third-party services: we may link to external sites but are not responsible for
                    their privacy practices.
                  </p>
                  <p>
                    9. Updates: we may revise our policy periodically and notify users of changes.
                  </p>
                  <p>
                    For more details, please visit our full{" "}
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Privacy Policy Page
                    </a>.
                  </p>
                </>
              )}

              {openModal === "terms" && (
                <>
                  <p>
                    By accessing and using this application, you agree to the following terms and conditions:
                  </p>
                  <p>1. Eligibility: Users must be 18+ or have guardian consent.</p>
                  <p>2. Account Security: You are responsible for maintaining account confidentiality.</p>
                  <p>3. Prohibited Activities: No unlawful, fraudulent, or abusive use of the platform.</p>
                  <p>4. Intellectual Property: All logos, content, and designs belong to the company.</p>
                  <p>5. Service Modifications: We reserve rights to update or discontinue services anytime.</p>
                  <p>6. Payment & Billing: If applicable, all transactions must comply with our guidelines.</p>
                  <p>7. Termination: Accounts violating rules may be suspended without notice.</p>
                  <p>8. Disclaimer: We are not liable for indirect damages caused by misuse.</p>
                  <p>9. Governing Law: These terms are governed by Indian law.</p>
                  <p>10. Updates: Terms may change and continued use indicates acceptance.</p>
                  <p>
                    Read the complete{" "}
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Terms & Conditions Page
                    </a>{" "}
                    for detailed information.
                  </p>
                </>
              )}

              {openModal === "help" && (
                <>
                  <p>
                    Need assistance? You can reach our support team anytime via email, phone, or knowledge base.
                  </p>
                  <p>
                    Common issues like login problems, account recovery, and order tracking are available in our
                    FAQs. For urgent matters, please call our helpline directly.
                  </p>
                  <p>
                    Visit our{" "}
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Support Center
                    </a>{" "}
                    for more resources.
                  </p>
                </>
              )}

              {openModal === "email" &&
                "For any issues, email us at support@example.com. Our team usually responds within 24–48 hours."}

              {openModal === "contact" &&
                "You can reach us at +91-9876543210 for urgent support (Mon–Sat, 10 AM – 6 PM)."}

              {openModal === "knowledge" &&
                "Browse our Knowledge Base for detailed articles, troubleshooting guides, and tutorials."}

              {openModal === "faqs" &&
                "Frequently Asked Questions: Find quick answers about login, billing, features, and more."}
            </div>

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
