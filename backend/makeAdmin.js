const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

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

const makeAdmin = async (email) => {
  try {
    await connectDB();

    if (!email) {
      console.log('\n❌ Please provide an email address');
      console.log('Usage: node makeAdmin.js your-email@example.com\n');
      process.exit(1);
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`\n❌ No user found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`\n✅ User ${user.email} is already an admin!`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`\n✅ Successfully made ${user.email} an admin!`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
makeAdmin(email);
