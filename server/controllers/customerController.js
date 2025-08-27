const Customer = require('../models/Customer');

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a customer
const addCustomer = async (req, res) => {
  const { name, mobile, city, DOB } = req.body;
  try {
    const newCustomer = new Customer({ name, mobile, city, DOB });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.findByIdAndDelete(id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getCustomers, addCustomer, updateCustomer, deleteCustomer };
