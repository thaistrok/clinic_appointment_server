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

// Function to populate the database with sample prescriptions
const populatePrescriptions = async () => {
  try {
    console.log('Populating database with prescriptions...');
    
    // Check if we have any doctors and patients in the database
    const doctors = await User.find({ role: 'doctor' });
    const patients = await User.find({ role: 'patient' });
    
    if (doctors.length === 0 || patients.length === 0) {
      console.log('No doctors or patients found in the database. Please create some users first.');
      mongoose.connection.close();
      return;
    }
    
    // Get appointments
    const appointments = await Appointment.find();
    
    if (appointments.length === 0) {
      console.log('No appointments found in the database. Please create some appointments first.');
      mongoose.connection.close();
      return;
    }
    
    // Create a prescription with all medications
    const allMedsPrescription = new Prescription({
      appointment: appointments[0]._id,
      doctor: appointments[0].doctor,
      patient: appointments[0].patient,
      diagnosis: 'Common medications for general treatment',
      medications: medications
    });
    
    await allMedsPrescription.save();
    console.log('Prescription with all medications created successfully!');
    
    // Create individual prescriptions for each medication
    for (let i = 0; i < Math.min(medications.length, appointments.length); i++) {
      const prescription = new Prescription({
        appointment: appointments[i]._id,
        doctor: appointments[i].doctor,
        patient: appointments[i].patient,
        diagnosis: `Prescription for ${medications[i].name}`,
        medications: [medications[i]]
      });
      
      await prescription.save();
    }
    
    console.log(`${Math.min(medications.length, appointments.length)} individual prescriptions created successfully!`);
    console.log('Database population completed.');
    
    // View the created prescriptions
    const prescriptions = await Prescription.find()
      .populate('doctor', 'name')
      .populate('patient', 'name')
      .populate('appointment');
    
    console.log(`\nTotal prescriptions in database: ${prescriptions.length}`);
    
    prescriptions.forEach((prescription, index) => {
      console.log(`\n--- Prescription ${index + 1} ---`);
      console.log(`Doctor: ${prescription.doctor?.name || 'N/A'}`);
      console.log(`Patient: ${prescription.patient?.name || 'N/A'}`);
      console.log(`Diagnosis: ${prescription.diagnosis}`);
      console.log(`Medications count: ${prescription.medications.length}`);
      
      prescription.medications.forEach((med, medIndex) => {
        console.log(`  ${medIndex + 1}. ${med.name} (${med.dosage}) - ${med.frequency}`);
      });
    });
    
    // Disconnect from database
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating prescriptions:', error);
    mongoose.connection.close();
  }
};

// Run the function
populatePrescriptions();