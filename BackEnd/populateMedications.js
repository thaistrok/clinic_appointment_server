const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medication = require('./models/Medication');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Sample medications data
  const medications = [
    { name: 'Aspirin', dosage: '100mg', frequency: 'Once daily' },
    { name: 'Ibuprofen', dosage: '200mg', frequency: 'Twice daily' },
    { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6 hours' },
    { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily' },
    { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
    { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily' }
  ];

  try {
    // Clear existing medications
    await Medication.deleteMany({});
    console.log('Cleared existing medications');

    // Insert new medications
    await Medication.insertMany(medications);
    console.log('Sample medications inserted');

    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error populating medications:', error);
    mongoose.connection.close();
  }
});