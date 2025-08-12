const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/appointment');
const User = require('./models/user');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Function to check appointments
const checkAppointments = async () => {
  try {
    console.log('Fetching appointments...');
    
    // Get a few appointments
    const appointments = await Appointment.find().limit(5).populate('doctor patient');
    
    console.log(`Found ${appointments.length} appointments:`);
    
    appointments.forEach((appointment, index) => {
      console.log(`\n--- Appointment ${index + 1} ---`);
      console.log(`ID: ${appointment._id}`);
      console.log(`Date: ${appointment.date}`);
      console.log(`Time: ${appointment.time}`);
      console.log(`Reason: ${appointment.reason}`);
      
      if (appointment.doctor) {
        console.log(`Doctor ID: ${appointment.doctor._id}`);
        console.log(`Doctor Name: ${appointment.doctor.name}`);
      } else {
        console.log('Doctor: Not found');
      }
      
      if (appointment.patient) {
        console.log(`Patient ID: ${appointment.patient._id}`);
        console.log(`Patient Name: ${appointment.patient.name}`);
      } else {
        console.log('Patient: Not found');
      }
    });
    
    console.log('\nFetching doctors...');
    const doctors = await User.find({ role: 'doctor' });
    console.log(`Found ${doctors.length} doctors:`);
    
    doctors.forEach((doctor, index) => {
      console.log(`${index + 1}. ID: ${doctor._id}, Name: ${doctor.name}`);
    });
    
    // Disconnect from database
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking appointments:', error);
    mongoose.connection.close();
  }
};

// Run the function
checkAppointments();