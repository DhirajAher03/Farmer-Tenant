import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CustomerPage from './Components/Pages/CustomerPage'
import Dashboard from './Components/dashboard/Dashboard'
import OrderPage from './Components/Pages/OrderPage'
import MeasurementEntry from './Components/Pages/MeasurementEntry'
import Layout from './Components/Layout/Layout'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="measurements" element={<MeasurementEntry />} />
          {/*   <Route path="messaging" element={<Messaging />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
