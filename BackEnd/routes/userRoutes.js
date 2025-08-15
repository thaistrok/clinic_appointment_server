const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDoctors,
  addDoctor,
  getAppointmentByUser
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware');
const router = express.Router();

router.use(authenticate);
router.get('/', authorize('admin'), getAllUsers);
router.get('/doctors', getDoctors);
router.post('/doctor', authorize('admin'), addDoctor);
router.get('/appointments', authorize('doctor', 'patient'), getAppointmentByUser);
router.get('/:id', getUserById);
router.put('/:id', (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied' });
}, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
module.exports = router;