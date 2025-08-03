const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create user - let the model handle password hashing
    const user = new User({
      name,
      email,
      password,
      role: role || 'patient'
    });
    
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log('Login attempt:', { email, password: password ? '***' : 'MISSING' });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user - explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    console.log('Database user lookup result:', user ? 'Found' : 'Not found');
    
    if (!user) {
      console.log('User not found in database for email:', email);
      return res.status(401).json({ message: 'Invalid credentials - User not found' });
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    // Check if password exists
    if (!user.password) {
      console.error('User password is undefined for user:', user._id);
      return res.status(500).json({ message: 'User account corrupted' });
    }

    // Check password - handle both single and double hashed passwords for backward compatibility
    let isMatch = await bcrypt.compare(password, user.password);
    console.log('Comparing passwords...');
    console.log('Password match (single hash):', isMatch);
    
    // If single hash doesn't match, try double hash for backward compatibility
    if (!isMatch) {
      console.log('Trying double hash comparison for backward compatibility...');
      const singleHashedPassword = await bcrypt.hash(password, 12);
      isMatch = await bcrypt.compare(singleHashedPassword, user.password);
      console.log('Password match (double hash):', isMatch);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials - Wrong password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      user:user,
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};