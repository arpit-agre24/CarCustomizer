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

const cleanupOrphanedOrders = async () => {
  try {
    await connectDB();

    console.log('\n=== CLEANING UP ORPHANED ORDERS ===\n');

    const allOrders = await Order.find();
    let deletedCount = 0;
    let keptCount = 0;
    
    for (const order of allOrders) {
      const userExists = await User.findById(order.user);
      const carExists = await Car.findById(order.car);
      
      if (!userExists || !carExists) {
        console.log(`🗑️  Deleting Order ${order._id}:`);
        console.log(`      User exists: ${!!userExists}`);
        console.log(`      Car exists: ${!!carExists}`);
        await Order.deleteOne({ _id: order._id });
        deletedCount++;
      } else {
        keptCount++;
      }
    }
    
    console.log('\n=== CLEANUP SUMMARY ===');
    console.log(`🗑️  Deleted orders: ${deletedCount}`);
    console.log(`✅ Kept orders: ${keptCount}`);
    
    if (deletedCount === 0) {
      console.log('\n✅ No orphaned orders found!');
    } else {
      console.log(`\n✅ Successfully removed ${deletedCount} orphaned order(s)`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up orders:', error);
    process.exit(1);
  }
};

cleanupOrphanedOrders();
