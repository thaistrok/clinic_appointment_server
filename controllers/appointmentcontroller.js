const Appointment = require('../models/appointment.js');
const User = require('../models/user.js');
const { validateAppointmentId } = require('../middleware');

const createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason, notes, duration, isEmergency, patient: providedPatient } = req.body;
    
    
    let patient;
    if (req.user.role === 'doctor') {
      
      if (!providedPatient) {
        return res.status(400).json({ message: 'Patient ID is required when creating appointment as a doctor' });
      }
      patient = providedPatient;
    } else {
     
      patient = req.user._id.toString();
    }
    
    
    const doctorId = doctor || req.user._id.toString();
    
    const doctorExists = await User.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time
    });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    const appointment = await Appointment.create({
      patient,
      doctor: doctorId,
      date: new Date(date),
      time,
      reason,
      notes,
      duration,
      isEmergency
    });
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { status, doctor, date } = req.query;
    let filter = {};
    if (req.user.role === 'patient') {
      filter.patient = req.user._id.toString();
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user._id.toString();
    }
    if (status) filter.status = status;
    if (doctor && req.user.role === 'admin') filter.doctor = doctor;
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

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { patient: req.user._id.toString() },
        { doctor: req.user._id.toString() }
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

const getAppointmentById = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialty experience');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const updateData = { ...req.body };
    delete updateData.patient;
    delete updateData.doctor;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('patient', 'name email phone')
     .populate('doctor', 'name email specialty experience');
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
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