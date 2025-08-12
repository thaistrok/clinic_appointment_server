const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
        appointment: {type: mongoose.Schema.Types.ObjectId,ref: 'Appointment',required: true},
        doctor: { type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
        patient: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
        medications: [{name: String,dosage: String,frequency: String}],
        diagnosis: {type: String,required: true}
  },
 {timestamps: true}
);

// Add indexes for better query performance
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ patient: 1 });
prescriptionSchema.index({ createdAt: -1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;