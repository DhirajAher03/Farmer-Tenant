import React, { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheckCircle } from "react-icons/ai"; // ✅ Added tick icon
import princelogo from "../../assets/princelogo.png";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ New state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const { data } = await API.post("/auth/login", { email, password });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);  // Save user email

        if (rememberMe) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        // ✅ Show success message
        setSuccessMessage("Login Successful!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/layout/dashboard");
        }, 1000); // ✅ 1 sec delay before redirect
      } else {
        setError("Login failed: token not received");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 relative">
      {/* ✅ Success Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <AiOutlineCheckCircle size={20} className="text-green-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        {/* Logo + Heading */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <img src={princelogo} alt="Prince Tailor Logo" className="w-12 h-12 object-contain rounded-lg shadow-sm" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Prince Tailor</h1>
          <p className="text-gray-500 text-sm">
            Sign in to your workspace <br /> Access dashboard, customers, and orders.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* ✅ Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          {/* Password + Eye Toggle */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400 pr-10"
              required
            />
            <span
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
          </div>

          {/* ✅ Remember Me */}
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4"
              />
              Remember Me
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
          </div>

          {/* ✅ Login Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiLogIn className="mr-2" /> Sign in
          </button>
        </form>

        {/* ✅ Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> &{" "}
          <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
