const User = require('../models/user.js');


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

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDoctors
};