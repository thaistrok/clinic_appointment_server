const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/appointment');
const User = require('./models/user');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Function to check a specific appointment
const checkSpecificAppointment = async (appointmentId) => {
  try {
    console.log(`Fetching appointment with ID: ${appointmentId}`);
    
    // Get the specific appointment
    const appointment = await Appointment.findById(appointmentId).populate('doctor patient');
    
    if (!appointment) {
      console.log('Appointment not found');
      mongoose.connection.close();
      return;
    }
    
    console.log('\n--- Appointment Details ---');
    console.log(`ID: ${appointment._id}`);
    console.log(`Date: ${appointment.date}`);
    console.log(`Time: ${appointment.time}`);
    console.log(`Reason: ${appointment.reason}`);
    console.log(`Status: ${appointment.status}`);
    
    if (appointment.doctor) {
      console.log(`\nDoctor:`);
      console.log(`  ID: ${appointment.doctor._id}`);
      console.log(`  Name: ${appointment.doctor.name}`);
      console.log(`  Role: ${appointment.doctor.role}`);
    } else {
      console.log('\nDoctor: Not assigned');
    }
    
    if (appointment.patient) {
      console.log(`\nPatient:`);
      console.log(`  ID: ${appointment.patient._id}`);
      console.log(`  Name: ${appointment.patient.name}`);
      console.log(`  Role: ${appointment.patient.role}`);
    } else {
      console.log('\nPatient: Not assigned');
    }
    
    // Check if the appointment has both doctor and patient
    if (!appointment.doctor) {
      console.log('\n⚠️  WARNING: This appointment does not have an assigned doctor');
    }
    
    if (!appointment.patient) {
      console.log('\n⚠️  WARNING: This appointment does not have an assigned patient');
    }
    
    // Fetch all doctors to see if we can find a match
    console.log('\n--- All Doctors ---');
    const doctors = await User.find({ role: 'doctor' });
    doctors.forEach((doctor, index) => {
      console.log(`${index + 1}. ID: ${doctor._id}, Name: ${doctor.name}`);
    });
    
    // Disconnect from database
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking appointment:', error);
    mongoose.connection.close();
  }
};

// Use the known good appointment ID from our previous check
const appointmentId = '689350b644b5f94541a4e357'; // Appointment with Dr. Yousif

checkSpecificAppointment(appointmentId);