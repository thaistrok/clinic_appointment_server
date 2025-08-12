const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create a medication schema
const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true }
});

const Medication = mongoose.model('Medication', medicationSchema);

// Function to view medications
const viewMedications = async () => {
  try {
    console.log('Fetching medications from database...');
    
    const medications = await Medication.find();
    
    console.log(`Found ${medications.length} medications:`);
    
    medications.forEach((med, index) => {
      console.log(`${index + 1}. ${med.name} - ${med.dosage} - ${med.frequency}`);
    });
    
    // Disconnect from database
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fetching medications:', error);
    mongoose.connection.close();
  }
};

// Run the function
viewMedications();