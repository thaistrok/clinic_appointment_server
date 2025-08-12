const express = require('express');
const router = express.Router();
const {
  getAllMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication
} = require('../controllers/medicationController');

// GET /api/medications - Get all medications
router.get('/', getAllMedications);

// GET /api/medications/:id - Get a specific medication
router.get('/:id', getMedicationById);

// POST /api/medications - Create a new medication
router.post('/', createMedication);

// PUT /api/medications/:id - Update a medication
router.put('/:id', updateMedication);

// DELETE /api/medications/:id - Delete a medication
router.delete('/:id', deleteMedication);

module.exports = router;