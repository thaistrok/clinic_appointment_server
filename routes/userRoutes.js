const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDoctors,
  addDoctor,
  getAppointmentByUser,
  getPatients
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware');
const router = express.Router();

router.use(authenticate);

// More specific routes should come before general ones
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);
router.get('/appointments', authorize('doctor', 'patient'), getAppointmentByUser);
router.get('/:id', getUserById);
router.put('/:id', (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied' });
}, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

// General routes should come after specific ones
router.post('/doctor', authorize('admin'), addDoctor);
router.get('/', authorize('admin'), getAllUsers);

module.exports = router;