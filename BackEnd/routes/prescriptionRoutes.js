const express = require('express');
const { getAllPrescriptions } = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware');
const router = express.Router();

router.use(authenticate);
router.get('/', authorize('patient', 'doctor', 'admin'), getAllPrescriptions);

module.exports = router;
