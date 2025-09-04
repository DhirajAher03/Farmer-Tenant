const express = require('express');
const { addOrder, getOrders, getNewOrderId, getOrdersByCustomer, getMeasurementsByCustomer, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');

const router = express.Router();


router.get('/all', getAllOrders); // Add this new route at the top
router.post('/', addOrder);
router.get('/new', getNewOrderId);
router.get('/:id', getOrders);
router.get('/:customerId/orders', getOrdersByCustomer);
router.get('/:customerId/measurements', getMeasurementsByCustomer);

// PATCH: Update order (status, measurements, etc)
router.patch('/:id', updateOrder);

// DELETE: Delete order
router.delete('/:id', deleteOrder);

module.exports = router;