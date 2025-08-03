const mongoose = require('mongoose');
const User = require('./models/user');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./db');

// Connect to database
connectDB();

// Test adding a doctor by admin
async function testAddDoctor() {
  try {
    // First, let's create an admin user if one doesn't exist
    let adminUser = await User.findOne({ email: 'admin@test.com' });
    
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created:', adminUser.name);
    } else {
      console.log('Admin user already exists:', adminUser.name);
    }
    
    // Now let's try to create a doctor user
    const doctorUser = new User({
      name: 'Dr. Test',
      email: 'dr@test.com',
      password: 'doctor123',
      role: 'doctor'
    });
    
    await doctorUser.save();
    console.log('Doctor user created:', doctorUser.name);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAddDoctor();