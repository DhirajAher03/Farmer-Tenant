const express = require('express');
const { addOrder, getOrders, getNewOrderId, getOrdersByCustomer, getMeasurementsByCustomer, getAllOrders } = require('../controllers/orderController');

const router = express.Router();

router.get('/all', getAllOrders); // Add this new route at the top
router.post('/', addOrder);
router.get('/new', getNewOrderId);
router.get('/:id', getOrders);
router.get("/:customerId/orders", getOrdersByCustomer);
router.get("/:customerId/measurements", getMeasurementsByCustomer);
// router.get('/status/counts', getOrderCounts); // New endpoint to get order counts by status
router.get('/', getAllOrders); // New endpoint to get all orders
// router.delete("/orders/:orderId", deleteOrderById); //endpoint to delete orders

module.exports = router;