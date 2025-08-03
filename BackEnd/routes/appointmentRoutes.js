const express = require('express');
const {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentcontroller.js');
const { authenticate, authorize } = require('../middleware');
const router = express.Router();


router.use(authenticate);
router.post('/', authorize('patient', 'admin'), createAppointment);
router.get('/', getAppointments);
router.get('/my', getMyAppointments); // New route for fetching user's own appointments
router.get('/:id', getAppointmentById);
router.put('/:id', authorize('patient', 'doctor', 'admin'), updateAppointment);
router.delete('/:id', authorize('patient', 'doctor', 'admin'), deleteAppointment);

module.exports = router;