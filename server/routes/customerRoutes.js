const express = require('express');
const { getCustomers, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { getOrdersByCustomer, getMeasurementsByCustomer } = require('../controllers/orderController');

const router = express.Router();

// Customer CRUD routes
router.get('/', getCustomers);
router.post('/', addCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

// Customer orders and measurements routes
router.get('/:id/orders', getOrdersByCustomer);
router.get('/:id/measurements', getMeasurementsByCustomer);

module.exports = router;
