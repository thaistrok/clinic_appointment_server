const jwt = require('jsonwebtoken');
const User = require('../models/user');

function stripToken(req) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error stripping token:', error);
    return null;
  }
}

function verifyToken(token) {
  try {
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token.' });
      }

      // Debug logging to see user data
      console.log('Authenticated user:', {
        id: user._id,
        role: user.role,
        name: user.name
      });

      req.user = user;
      next();
    } else {
      res.status(401).json({ status: 'Error', message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

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

const validateAppointmentId = (req, res, next) => {
  if (!req.params.id || req.params.id === 'undefined') {
    return res.status(400).json({ message: 'Appointment ID is required' });
  }
  next();
};

const checkAppointmentAuthorization = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'admin') {
      if (req.user.role === 'doctor') {
        if (!appointment.doctor) {
          return res.status(403).json({ 
            message: 'Access denied. This appointment is not assigned to a doctor.' 
          });
        }
        
        if (appointment.doctor.toString() !== req.user._id.toString()) {
          return res.status(403).json({ 
            message: 'Access denied. You are not the assigned doctor for this appointment.' 
          });
        }
      }
      else if (req.user.role === 'patient') {
        if (!appointment.patient) {
          return res.status(403).json({ 
            message: 'Access denied. This appointment is not assigned to a patient.' 
          });
        }
        
        if (appointment.patient.toString() !== req.user._id.toString()) {
          return res.status(403).json({ 
            message: 'Access denied. You are not the assigned patient for this appointment.' 
          });
        }
      }
      else {
        return res.status(403).json({ message: 'Access denied. Invalid user role.' });
      }
    }
    
    req.appointment = appointment;
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: 'Authorization error: ' + error.message });
  }
};

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