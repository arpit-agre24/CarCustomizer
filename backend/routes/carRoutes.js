const express = require('express');
const {
  getCars,
  getCar,
  getCustomizationOptions,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCars);
router.get('/:id', getCar);
router.get('/:id/customization', getCustomizationOptions);

// Admin routes
router.post('/', protect, authorize('admin'), createCar);
router.put('/:id', protect, authorize('admin'), updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);

module.exports = router;
