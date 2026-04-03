const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to process payment for this order'
      });
    }

    // Create payment intent for INR
    console.log('Creating payment intent for amount:', amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in INR (smallest unit is already 1 INR)
      currency: 'inr', // Indian Rupee instead of USD
      metadata: {
        orderId: orderId,
        userId: req.user.id
      }
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment intent'
    });
  }
};

// @desc    Get Stripe publishable key
// @route   GET /api/payment/config
// @access  Public
exports.getStripeConfig = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Webhook handler for Stripe events
// @route   POST /api/payment/webhook
// @access  Public
exports.webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update order payment status
      const orderId = paymentIntent.metadata.orderId;
      const order = await Order.findById(orderId);
      
      if (order) {
        order.paymentInfo = {
          paymentId: paymentIntent.id,
          paymentMethod: 'stripe',
          paymentStatus: 'completed',
          paidAt: Date.now()
        };
        order.orderStatus = 'confirmed';
        await order.save();
      }
      
      console.log(`PaymentIntent ${paymentIntent.id} was successful!`);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      // Update order payment status to failed
      const failedOrderId = failedPayment.metadata.orderId;
      const failedOrder = await Order.findById(failedOrderId);
      
      if (failedOrder) {
        failedOrder.paymentInfo = {
          paymentId: failedPayment.id,
          paymentMethod: 'stripe',
          paymentStatus: 'failed'
        };
        await failedOrder.save();
      }
      
      console.log(`PaymentIntent ${failedPayment.id} failed!`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
