const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Prescription = require('./models/prescription');
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

// Function to add medications to a prescription
const addPrescriptions = async () => {
  try {
    console.log('Adding medications to database...');
    
    // Since we don't have actual appointments, doctors, or patients in the database,
    // we'll create a sample prescription with these medications
    // In a real application, you would associate these with actual appointments
    
    // Create a sample prescription with all medications
    const samplePrescription = new Prescription({
      // These would normally be actual ObjectIds from the database
      appointment: new mongoose.Types.ObjectId(),
      doctor: new mongoose.Types.ObjectId(),
      patient: new mongoose.Types.ObjectId(),
      diagnosis: 'Sample diagnosis for medication database population',
      medications: medications
    });
    
    await samplePrescription.save();
    console.log('Sample prescription with medications added successfully!');
    
    // Also create individual prescriptions for each medication for demonstration
    for (let i = 0; i < medications.length; i++) {
      const prescription = new Prescription({
        appointment: new mongoose.Types.ObjectId(),
        doctor: new mongoose.Types.ObjectId(),
        patient: new mongoose.Types.ObjectId(),
        diagnosis: `Sample diagnosis for ${medications[i].name}`,
        medications: [medications[i]]
      });
      
      await prescription.save();
    }
    
    console.log(`${medications.length} individual prescriptions created successfully!`);
    console.log('All medications have been added to the database.');
    
    // Disconnect from database
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding prescriptions:', error);
    mongoose.connection.close();
  }
};

// Run the function
addPrescriptions();