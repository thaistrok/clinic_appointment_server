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
const { validateAndAuthorizeAppointment } = require('../middleware/appointmentMiddleware');
const router = express.Router();


router.use(authenticate);
router.post('/', authorize('patient', 'admin'), createAppointment);
router.get('/', getAppointments);
router.get('/my', getMyAppointments); // New route for fetching user's own appointments
router.get('/:id', ...validateAndAuthorizeAppointment, getAppointmentById);
router.put('/:id', ...validateAndAuthorizeAppointment, updateAppointment);
router.delete('/:id', ...validateAndAuthorizeAppointment, deleteAppointment);

module.exports = router;