const express = require('express');
const { addOrder, getOrders, getNewOrderId, getOrdersByCustomer,getMeasurementsByCustomer } = require('../controllers/orderController');

const router = express.Router();

router.post('/', addOrder);
router.get('/new', getNewOrderId); // New endpoint to generate order ID
router.get('/:id', getOrders);
router.get("/:customerId/orders", getOrdersByCustomer);
router.get("/:customerId/measurements", getMeasurementsByCustomer);

module.exports = router;