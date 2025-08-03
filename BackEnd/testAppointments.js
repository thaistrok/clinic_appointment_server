const mongoose = require('mongoose');
const User = require('./models/user');
const Appointment = require('./models/appointment');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./db');

// Connect to database
connectDB();

// Test adding appointments and fetching user-specific appointments
async function testAppointments() {
  try {
    // Create test users if they don't exist
    let patientUser = await User.findOne({ email: 'patient@test.com' });
    if (!patientUser) {
      patientUser = new User({
        name: 'Test Patient',
        email: 'patient@test.com',
        password: 'patient123',
        role: 'patient'
      });
      await patientUser.save();
      console.log('Patient user created:', patientUser.name);
    } else {
      console.log('Patient user already exists:', patientUser.name);
    }

    let doctorUser = await User.findOne({ email: 'doctor@test.com' });
    if (!doctorUser) {
      doctorUser = new User({
        name: 'Test Doctor',
        email: 'doctor@test.com',
        password: 'doctor123',
        role: 'doctor'
      });
      await doctorUser.save();
      console.log('Doctor user created:', doctorUser.name);
    } else {
      console.log('Doctor user already exists:', doctorUser.name);
    }

    // Create a test appointment
    const appointment = new Appointment({
      patient: patientUser._id,
      doctor: doctorUser._id,
      date: new Date(),
      time: '10:00',
      reason: 'Regular checkup'
    });
    
    await appointment.save();
    console.log('Appointment created with ID:', appointment._id);
    
    console.log('Test data setup complete. You can now test the /api/appointments/my endpoint.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAppointments();