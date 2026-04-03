const Order = require('../models/Order');
const Car = require('../models/Car');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      carId,
      customization,
      customerDetails
    } = req.body;

    // Get car details
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Calculate pricing
    let customizationPrice = 0;
    
    if (customization.color) {
      customizationPrice += customization.color.price || 0;
    }
    if (customization.wheels) {
      customizationPrice += customization.wheels.price || 0;
    }
    if (customization.bumper) {
      customizationPrice += customization.bumper.price || 0;
    }
    if (customization.spoiler) {
      customizationPrice += customization.spoiler.price || 0;
    }
    if (customization.extras && customization.extras.length > 0) {
      customization.extras.forEach(extra => {
        customizationPrice += extra.price || 0;
      });
    }

    const totalPrice = car.basePrice + customizationPrice;

    // Create order
    let order = await Order.create({
      user: req.user.id,
      car: carId,
      customization,
      pricing: {
        basePrice: car.basePrice,
        customizationPrice,
        totalPrice
      },
      customerDetails
    });

    // Populate after creation
    order = await Order.findById(order._id)
      .populate('car', 'name brand model thumbnail')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('car', 'name brand model thumbnail')
      .populate('user', 'name email')
      .sort('-createdAt');
    
    console.log('getMyOrders - Found orders:', orders.length);
    orders.forEach((order, i) => {
      console.log(`Order ${i}:`, {
        id: order._id,
        carId: order.car?._id || order.car,
        carName: order.car?.name,
        carPopulated: !!order.car?.name
      });
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('car')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    ).populate('car', 'name brand model');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, paymentMethod, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentInfo = {
      paymentId,
      paymentMethod,
      paymentStatus,
      paidAt: paymentStatus === 'completed' ? Date.now() : undefined
    };

    if (paymentStatus === 'completed') {
      order.orderStatus = 'confirmed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
