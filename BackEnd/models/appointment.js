const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
        patient: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
        doctor: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
        date: {type: Date,required: true},
        time: {type: String,required: true},
        status: {type: String,
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
        default: 'scheduled'},
        reason: {type: String,required: true},
        notes: {type: String},
        duration: {type: Number, default: 30}, // in minutes
        isEmergency: {type: Boolean, default: false}
  },
 {timestamps: true}
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;