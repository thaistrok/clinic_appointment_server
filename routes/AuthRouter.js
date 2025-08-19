const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getUserProfile, updatePassword } = require('../controllers/AuthController');
const { authenticate } = require('../middleware');
const router = express.Router();

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];

const updatePasswordValidation = [
  body('oldPassword').exists().withMessage('Old password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/profile', authenticate, getUserProfile);
router.put('/password', authenticate, updatePasswordValidation, updatePassword);

module.exports = router;