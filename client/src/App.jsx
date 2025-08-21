import { useState } from 'react'
import './App.css'
import Dashboard from './Components/dashboard/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Components/Layout/Layout'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="measurements" element={<Measurements />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
