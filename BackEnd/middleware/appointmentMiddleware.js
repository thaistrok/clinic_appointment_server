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
  validateAppointmentId,
  checkAppointmentAuthorization,
  validateAndAuthorizeAppointment
};