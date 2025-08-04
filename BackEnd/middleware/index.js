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
    const user = await User.findById(decoded.id).select('-password');
    
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

// Import appointment middleware functions
const { 
  validateAppointmentId, 
  checkAppointmentAuthorization, 
  validateAndAuthorizeAppointment 
} = require('./appointmentMiddleware');

module.exports = {
  stripToken,
  verifyToken,
  authenticate,
  authorize,
  validateAppointmentId,
  checkAppointmentAuthorization,
  validateAndAuthorizeAppointment
};