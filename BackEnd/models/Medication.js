const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true }
}, { timestamps: true });


medicationSchema.index({ name: 1, dosage: 1 });

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;