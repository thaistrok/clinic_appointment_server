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

// Get user by ID
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

// Update user
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

// Delete user (soft delete)
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

// Get doctors only
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add doctor by admin doctor
const addDoctor = async (req, res) => {
  try {
    // Only admin users can add new doctors
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can add new doctors.' });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Doctor already exists with this email' });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Create new doctor
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
      // Fetch appointments where the doctor's ID matches
      appointments = await Appointment.find({ doctor: userId });
    } else if (req.user.role === 'patient') {
      // Fetch appointments where the patient's ID matches
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
  addDoctor,
  getAppointmentByUser // Add the new function to the exports
};