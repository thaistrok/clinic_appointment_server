const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
  // Extract fields
  const { name, email, password, role, specialty } = req.body;

  try {
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please include a valid email' });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: role || 'patient', // Default to patient if no role specified
      specialty
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5d'
    }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).send('Server error');
      }
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Explicitly select the password field
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!password || !user.password) {
      console.error('Missing password or user.password');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5d'
    }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).send('Server error');
      }
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Logout user
// @route  POST /api/auth/logout
// @access Public
exports.logoutUser = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Get user profile
// @route  GET /api/auth/profile
// @access Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
exports.updateUserProfile = async (req, res) => {
  const { name, email, specialty } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (specialty) user.specialty = specialty;

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Update password
// @route  PUT /api/auth/password
// @access Private
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Basic validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Explicitly select the password field since it's not included by default
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a password
    if (!user.password) {
      return res.status(500).json({ message: 'User password not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password directly to avoid double hashing by pre-save hook
    await User.findByIdAndUpdate(user.id, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Delete account
// @route  DELETE /api/auth/account
// @access Private
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Refresh token
// @route  POST /api/auth/refresh
// @access Private
exports.refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5d'
    }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).send('Server error');
      }
      res.json({ token });
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Verify email
// @route  GET /api/auth/verify-email
// @access Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // In a real implementation, you would verify the token against your database
    // For now, we'll just send a success message
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Forgot password
// @route  POST /api/auth/forgot-password
// @access Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // In a real implementation, you would save this token to the database
    // and send an email to the user with a link containing this token
    
    res.json({ 
      message: 'Password reset link sent to your email',
      resetToken // In production, don't send this in the response
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Reset password
// @route  POST /api/auth/reset-password
// @access Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // In a real implementation, you would verify the token and update the password
    // For now, we'll just send a success message
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).send('Server error');
  }
};

// @desc   Resend verification email
// @route  POST /api/auth/resend-verification
// @access Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real implementation, you would generate a new verification token
    // and send an email to the user
    
    res.json({ message: 'Verification email sent successfully' });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).send('Server error');
  }
};
