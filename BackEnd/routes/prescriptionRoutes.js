const express = require('express');
const { 
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription
} = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware');
const router = express.Router();

router.use(authenticate);
router.get('/', authorize('patient', 'doctor', 'admin'), getAllPrescriptions);
router.get('/:id', authorize('patient', 'doctor', 'admin'), getPrescription);
router.post('/', authorize('doctor', 'admin'), createPrescription);
router.put('/:id', authorize('doctor', 'admin'), updatePrescription);
router.delete('/:id', authorize('doctor', 'admin'), deletePrescription);

module.exports = router;