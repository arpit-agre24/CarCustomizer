const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const Car = require('./models/Car');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const testAdminQuery = async () => {
  try {
    await connectDB();

    console.log('\n=== TESTING ADMIN DASHBOARD QUERY ===\n');

    // This is the exact query from adminController.js
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('car', 'name brand model thumbnail')
      .sort('-createdAt')
      .limit(10);
    
    console.log(`Found ${recentOrders.length} orders\n`);
    
    recentOrders.forEach((order, i) => {
      console.log(`Order ${i + 1}:`);
      console.log(`  ID: ${order._id}`);
      console.log(`  User: ${order.user?.name || 'NULL'} (${order.user?.email || 'NULL'})`);
      console.log(`  Car: ${order.car?.name || 'NULL'} (Brand: ${order.car?.brand || 'NULL'})`);
      console.log(`  Status: ${order.orderStatus}`);
      console.log(`  Price: $${order.pricing.totalPrice}`);
      console.log(`  Created: ${order.createdAt}\n`);
    });

    // Also test the aggregation
    console.log('=== TESTING ORDERS BY STATUS AGGREGATION ===\n');
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('Orders by status:', ordersByStatus);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testAdminQuery();
