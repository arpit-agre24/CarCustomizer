const express = require('express');
const {
  getAllOrders,
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/orders', asyncHandler(getAllOrders));
router.get('/stats', asyncHandler(getDashboardStats));
router.get('/users', asyncHandler(getAllUsers));
router.put('/users/:id/role', asyncHandler(updateUserRole));
router.delete('/users/:id', asyncHandler(deleteUser));

module.exports = router;
