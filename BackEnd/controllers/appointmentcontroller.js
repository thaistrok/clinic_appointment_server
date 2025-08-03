const Appointment = require('../models/appointment.js');
const User = require('../models/user.js');

// Create Appointment
const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time, reason, notes, duration, isEmergency } = req.body;

    // Check if doctor and patient exist
    const doctorExists = await User.findById(doctor);
    const patientExists = await User.findById(patient);

    if (!doctorExists || !patientExists) {
      return res.status(404).json({ message: 'Doctor or Patient not found' });
    }

    // Check if appointment already exists for the same time slot
    const existingAppointment = await Appointment.findOne({
      doctor,
      date: new Date(date),
      time
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      date: new Date(date),
      time,
      reason,
      notes,
      duration,
      isEmergency
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Appointments
const getAppointments = async (req, res) => {
  try {
    const { status, doctor, patient, date } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;
    if (date) filter.date = new Date(date);

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialty experience')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Appointments for the authenticated user
const getMyAppointments = async (req, res) => {
  try {
    // Get appointments where the user is either the patient or doctor
    const appointments = await Appointment.find({
      $or: [
        { patient: req.user.id },
        { doctor: req.user.id }
      ]
    })
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialty experience')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialty experience');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to view this appointment
    if (req.user.role !== 'admin' && 
        appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Appointment
const updateAppointment = async (req, res) => {
  try {
    // Check if ID is provided and valid
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }

    // First find the appointment to check permissions
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to update this appointment
    if (req.user.role !== 'admin' && 
        appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'name email phone')
     .populate('doctor', 'name email specialty experience');

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
  try {
    // Check if ID is provided and valid
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }

    // First find the appointment to check permissions
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to delete this appointment
    if (req.user.role !== 'admin' && 
        appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};