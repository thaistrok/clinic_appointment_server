const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');


// Load environment variables
dotenv.config();

console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('PORT:', process.env.PORT || '5000');

// Import database connection
const connectDB = require('./db');

// Import routes
const AuthRouter = require('./routes/AuthRouter');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173','http://127.0.0.1:5173','http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Add this to your server.js
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Add this to your server.js
app.get('/', (req, res) => {
  res.json({ message: 'Clinic Appointment API is running!' });
});

// Add this after the middleware setup and before the 404 handler
app.get('/', (req, res) => {
  res.json({
    message: 'Clinic Appointment System API',
    version: '1.0.0',
    description: 'API for managing clinic appointments',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      appointments: '/api/appointments'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
