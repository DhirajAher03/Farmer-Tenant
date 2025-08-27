const express = require('express');
const Order =require('../models/Order')
const generateOrderId = require('../utils/generateOrderId');

// Add Order 
const addOrder = async (req, res) => {
  try {
    const { 
      orderId,
      customerId, 
      garmentType, 
      status, 
      orderDate, 
      dueDate, 
      notes,
      measurements 
    } = req.body;

    if (!customerId || !garmentType || !orderDate) {
      return res.status(400).json({ 
        message: "Required fields missing: customerId, garmentType, and orderDate are required" 
      });
    }

    const newOrder = new Order({
      orderId,
      customerId,
      garmentType,
      status,
      orderDate: new Date(orderDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes,
      measurements
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get All Orders
const getOrders = async (req, res) => {
    try {
    const orders = await Order.find({ customerId: req.params.id }).populate("customerId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
}

// Generate New Order ID
const getNewOrderId = async (req, res) => {
  try {
    const orderId = generateOrderId();
    res.json({ orderId });
  } catch (error) {
    console.error("Error generating order ID:", error);
    res.status(500).json({ message: "Error generating order ID" });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMeasurementsByCustomer = async (req, res) => {
  try {
    // Get the latest order with measurements for this customer
    const order = await Order.findOne(
      { customerId: req.params.id, measurements: { $exists: true, $ne: null } },
      { measurements: 1 }
    ).sort({ orderDate: -1 });

    if (order && order.measurements) {
      res.json(order.measurements);
    } else {
      res.json([]); // Return empty array if no measurements found
    }
  } catch (error) {
    console.error("Error fetching measurements:", error);
    res.status(500).json({ error: "Error fetching measurements" });
  }
};

module.exports = { addOrder, getOrders, getNewOrderId, getOrdersByCustomer, getMeasurementsByCustomer };