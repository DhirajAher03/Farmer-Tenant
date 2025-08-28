import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import CustomerPage from './Components/Pages/CustomerPage';
import Dashboard from './Components/dashboard/Dashboard';
import OrderPage from './Components/Pages/OrderPage';
import MeasurementEntry from './Components/Pages/MeasurementEntry';
import Layout from './Components/Layout/Layout';
import LoginPage from './Components/Pages/LoginPage';
import SettingsPage from './Components/Pages/SettingPage';
import ProtectedRoute from './Components/ProtectedRoute'; // ✅ import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Layout */}
        <Route
          path="/layout"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="orders" element={<OrderPage/>} />
          <Route path="measurements" element={<MeasurementEntry />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
