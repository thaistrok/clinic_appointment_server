const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Prescription = require('./models/prescription');
const User = require('./models/user');
const Appointment = require('./models/appointment');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();
// Function to view prescriptions
const viewPrescriptions = async () => {
  try {
    console.log('Fetching prescriptions from database...');
    
    const prescriptions = await Prescription.find();
    
    console.log(`Found ${prescriptions.length} prescriptions:`);
    
    prescriptions.forEach((prescription, index) => {
      console.log(`\n--- Prescription ${index + 1} ---`);
      console.log(`ID: ${prescription._id}`);
      console.log(`Diagnosis: ${prescription.diagnosis}`);
      console.log(`Created At: ${prescription.createdAt}`);
      console.log('Medications:');
      
      prescription.medications.forEach((med, medIndex) => {
        console.log(`  ${medIndex + 1}. ${med.name} - ${med.dosage} - ${med.frequency}`);
      });
    });
    
    // Disconnect from database
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    mongoose.connection.close();
  }
};

// Run the function
viewPrescriptions();