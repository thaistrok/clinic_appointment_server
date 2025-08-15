const Medication = require('../models/Medication');

const getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find().sort({ name: 1 });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medications', error: error.message });
  }
};

const getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medication', error: error.message });
  }
};

const createMedication = async (req, res) => {
  try {
    const { name, dosage, frequency } = req.body;

    const existingMedication = await Medication.findOne({ name, dosage });
    if (existingMedication) {
      return res.status(400).json({ message: 'Medication with this name and dosage already exists' });
    }

    const medication = new Medication({ name, dosage, frequency });
    const savedMedication = await medication.save();
    res.status(201).json(savedMedication);
  } catch (error) {
    res.status(400).json({ message: 'Error creating medication', error: error.message });
  }
};

const updateMedication = async (req, res) => {
  try {
    const { name, dosage, frequency } = req.body;
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { name, dosage, frequency },
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json(medication);
  } catch (error) {
    res.status(400).json({ message: 'Error updating medication', error: error.message });
  }
};

const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medication', error: error.message });
  }
};

module.exports = {
  getAllMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication
};