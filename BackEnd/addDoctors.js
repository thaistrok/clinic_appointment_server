const mongoose = require('mongoose');
const User = require('./models/user');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./db');

// Connect to database
connectDB();

// Doctor data from your request
const doctorsData = [
  {
    id: 1,
    name: 'Dr. Yousif',
    specialty: 'Node.js_Express.js_React.js_Pytyhon',
    experience: '10 years',
    email: 'yousif@clinic.com',
    password: 'doctor123'
  },
  {
    id: 2,
    name: 'Dr. Michael',
    specialty: 'Express.js_React.js',
    experience: '8 years',
    email: 'michael@clinic.com',
    password: 'doctor123'
  },
  {
    id: 3,
    name: 'Dr. Omar',
    specialty: 'Python',
    experience: '12 years',
    email: 'omar@clinic.com',
    password: 'doctor123'
  },
  {
    id: 4,
    name: 'Dr. Mahmooud',
    specialty: 'Node.js',
    experience: '6 years',
    email: 'mahmooud@clinic.com',
    password: 'doctor123'
  },
  {
    id: 5,
    name: 'Dr. Noor',
    specialty: 'typescript.ts',
    experience: '3 years',
    email: 'noor@clinic.com',
    password: 'doctor123'
  },
  {
    id: 6,
    name: 'Dr. Denis Dujota',
    specialty: 'Pro_Python',
    experience: '15 years',
    email: 'denis@clinic.com',
    password: 'doctor123'
  }
];

async function addDoctors() {
  try {
    console.log('Adding doctors to the database...');
    
    for (const doctorData of doctorsData) {
      // Check if doctor already exists
      const existingDoctor = await User.findOne({ email: doctorData.email });
      
      if (existingDoctor) {
        console.log(`Doctor ${doctorData.name} already exists`);
        continue;
      }
      
      // Create new doctor user
      const doctor = new User({
        name: doctorData.name,
        email: doctorData.email,
        password: doctorData.password,
        role: 'doctor',
        specialty: doctorData.specialty,
        experience: doctorData.experience
      });
      
      await doctor.save();
      console.log(`Doctor ${doctorData.name} added successfully`);
    }
    
    console.log('All doctors processed');
    process.exit(0);
  } catch (error) {
    console.error('Error adding doctors:', error.message);
    process.exit(1);
  }
}

addDoctors();