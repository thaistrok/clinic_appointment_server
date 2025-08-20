const User = require('../models/user.js');
const Appointment = require('../models/appointment.js');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        dateOfBirth,
        gender,
        address
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    console.log('Fetching doctors list');
    const doctors = await User.find({ role: 'doctor', isActive: true }).select('-password');
    console.log(`Found ${doctors.length} doctors`);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPatients = async (req, res) => {
  try {
    // Only allow doctors and admins to get patient lists
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
    const patients = await User.find({ role: 'patient', isActive: true }).select('name email');
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: error.message });
  }
};

const addDoctor = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can add new doctors.' });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Doctor already exists with this email' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const doctor = new User({
      name,
      email,
      password,
      role: 'doctor'
    });

    await doctor.save();

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointmentByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    let appointments;

    if (req.user.role === 'doctor') {
      appointments = await Appointment.find({ doctor: userId });
    } else if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patient: userId });
    }

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDoctors,
  getPatients,
  addDoctor,
  getAppointmentByUser
};