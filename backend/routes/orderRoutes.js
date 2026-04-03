const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/', protect, asyncHandler(createOrder));
router.get('/myorders', protect, asyncHandler(getMyOrders));
router.get('/:id', protect, asyncHandler(getOrder));
router.put('/:id/status', protect, authorize('admin'), asyncHandler(updateOrderStatus));
router.put('/:id/payment', protect, asyncHandler(updatePaymentStatus));

module.exports = router;
