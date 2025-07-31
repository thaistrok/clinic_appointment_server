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
        reason: {type: String,required: true}
  },
 {timestamps: true}
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;