// index.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Strip Token Middleware
const stripToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      res.locals.token = token;
      return next();
    }
    res.status(401).json({ status: 'Error', message: 'Unauthorized' });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: 'Error', message: 'Strip Token Error!' });
  }
};

// Verify Token Middleware
const verifyToken = (req, res, next) => {
    const {token} = res.locals;

    try {
        let payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload) {
            res.locals.payload = payload;
            return next();
        }
        res.status(401).send({ status: 'Error', message: 'Unauthorized'});
    } catch (error) {
        console.log(error);
        res.status(401).send({ status: 'Error', msg: 'Verify Token Err!'});
    }
};

// JWT Authentication Middleware (Combined)
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Authorization Middleware - Check user role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

const Appointment = require('../models/appointment');

// Validate appointment ID
const validateAppointmentId = (req, res, next) => {
  if (!req.params.id || req.params.id === 'undefined') {
    return res.status(400).json({ message: 'Appointment ID is required' });
  }
  next();
};

// Check if user is authorized to access appointment
const checkAppointmentAuthorization = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to access this appointment
    if (req.user.role !== 'admin' && 
        appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Attach appointment to request for use in controller
    req.appointment = appointment;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Combined middleware for validating ID and checking authorization
const validateAndAuthorizeAppointment = [
  validateAppointmentId,
  checkAppointmentAuthorization
];

module.exports = {
  stripToken,
  verifyToken,
  authenticate,
  authorize,
  validateAppointmentId,
  checkAppointmentAuthorization,
  validateAndAuthorizeAppointment
};
