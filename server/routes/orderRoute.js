const express = require('express');
const { addOrder, getOrders, getNewOrderId, getOrdersByCustomer, getAllOrders, getMeasurementsByCustomer, getOrderCounts, deleteOrderById } = require('../controllers/orderController');

const router = express.Router();

router.post('/', addOrder);
router.get('/new', getNewOrderId); // New endpoint to generate order ID
router.get('/:id', getOrders);
router.get("/:customerId/orders", getOrdersByCustomer);
router.get("/:customerId/measurements", getMeasurementsByCustomer);
router.get('/status/counts', getOrderCounts); // New endpoint to get order counts by status
router.get('/', getAllOrders); // New endpoint to get all orders
// router.delete("/orders/:orderId", deleteOrderById); //endpoint to delete orders

module.exports = router;