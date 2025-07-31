const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentcontroller.js');
const { authenticate, authorize } = require('../middleware');
const router = express.Router();


router.use(authenticate);
router.post('/', authorize('patient', 'admin'), createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', authorize('doctor', 'admin'), updateAppointment);
router.delete('/:id', authorize('admin'), deleteAppointment);

module.exports = router;