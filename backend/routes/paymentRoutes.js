const express = require('express');
const {
  createPaymentIntent,
  getStripeConfig,
  webhookHandler
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/config', getStripeConfig);

// Webhook route (no auth middleware, verified by Stripe signature)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookHandler
);

module.exports = router;
