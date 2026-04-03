const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const Car = require('./models/Car');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected:', process.env.MONGODB_URI);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const checkDatabase = async () => {
  try {
    await connectDB();

    console.log('\n=== DATABASE CONTENTS ===\n');

    // Check Users
    const userCount = await User.countDocuments();
    console.log(`👥 Users: ${userCount}`);
    const users = await User.find().select('name email role');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check Cars
    const carCount = await Car.countDocuments();
    console.log(`\n🚗 Cars: ${carCount}`);
    const cars = await Car.find().select('name brand basePrice');
    cars.forEach(car => {
      console.log(`   - ${car.brand} ${car.name} - $${car.basePrice}`);
    });

    // Check Orders
    const orderCount = await Order.countDocuments();
    console.log(`\n📦 Orders: ${orderCount}`);
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('car', 'name brand');
    
    if (orders.length > 0) {
      orders.forEach((order, i) => {
        console.log(`\n   Order ${i + 1}:`);
        console.log(`      ID: ${order._id}`);
        console.log(`      User: ${order.user?.name || 'Unknown'} (${order.user?.email || 'No email'})`);
        console.log(`      Car: ${order.car?.name || 'Unknown'} (${order.car?.brand || 'No brand'})`);
        console.log(`      Total Price: $${order.pricing.totalPrice}`);
        console.log(`      Status: ${order.orderStatus}`);
        console.log(`      Created: ${order.createdAt}`);
      });
    } else {
      console.log('   No orders found in database');
    }

    // Check for orders with missing references
    console.log('\n=== CHECKING FOR DATA INTEGRITY ===');
    const allOrders = await Order.find();
    let brokenRefs = 0;
    
    for (const order of allOrders) {
      const userExists = await User.findById(order.user);
      const carExists = await Car.findById(order.car);
      
      if (!userExists || !carExists) {
        brokenRefs++;
        console.log(`⚠️  Order ${order._id} has broken references:`);
        console.log(`      User exists: ${!!userExists}`);
        console.log(`      Car exists: ${!!carExists}`);
      }
    }
    
    if (brokenRefs === 0) {
      console.log('✅ All order references are valid');
    } else {
      console.log(`⚠️  ${brokenRefs} order(s) have broken references`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
};

checkDatabase();
