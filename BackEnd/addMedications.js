const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Array of medications to add
const medications = [
  { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours' },
  { name: 'Ibuprofen', dosage: '200mg', frequency: 'Every 8 hours' },
  { name: 'Amoxicillin', dosage: '250mg', frequency: 'Every 8 hours' },
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice a day' },
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' },
  { name: 'Omeprazole', dosage: '40mg', frequency: 'Once daily before breakfast' },
  { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily' },
  { name: 'Salbutamol', dosage: '100mcg', frequency: 'As needed (max 4 times/day)' },
  { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Once daily in the morning' },
  { name: 'Azithromycin', dosage: '500mg', frequency: 'Once daily for 3 days' },
  { name: 'Levothyroxine', dosage: '75mcg', frequency: 'Once daily before breakfast' },
  { name: 'Losartan', dosage: '50mg', frequency: 'Once daily' },
  { name: 'Insulin Glargine', dosage: '10 units', frequency: 'Once daily at bedtime' },
  { name: 'Clopidogrel', dosage: '75mg', frequency: 'Once daily' },
  { name: 'Diazepam', dosage: '5mg', frequency: 'Twice daily as needed' },
  { name: 'Ranitidine', dosage: '150mg', frequency: 'Twice daily' },
  { name: 'Furosemide', dosage: '40mg', frequency: 'Once daily in the morning' },
  { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
  { name: 'Fluoxetine', dosage: '20mg', frequency: 'Once daily in the morning' }
];

// Create a medication schema
const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true }
});

const Medication = mongoose.model('Medication', medicationSchema);

// Function to add medications to the database
const addMedications = async () => {
  try {
    console.log('Adding medications to database...');
    
    // Clear existing medications
    await Medication.deleteMany({});
    console.log('Cleared existing medications.');
    
    // Add all medications
    for (const medication of medications) {
      const newMedication = new Medication(medication);
      await newMedication.save();
    }
    
    console.log(`${medications.length} medications added successfully!`);
    
    // Verify by fetching all medications
    const allMedications = await Medication.find();
    console.log('\nMedications in database:');
    allMedications.forEach((med, index) => {
      console.log(`${index + 1}. ${med.name} - ${med.dosage} - ${med.frequency}`);
    });
    
    // Disconnect from database
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding medications:', error);
    mongoose.connection.close();
  }
};

// Run the function
addMedications();