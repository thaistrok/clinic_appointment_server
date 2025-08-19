const Prescription = require('../models/prescription');
const Appointment = require('../models/appointment');

exports.getAllPrescriptions = async (req, res) => {
  try {
    let prescriptions;
    
    if (req.user.role === 'patient') {
      prescriptions = await Prescription.find({ patient: req.user._id })
        .populate('patient', 'name _id')
        .populate('doctor', 'name specialty _id')
        .populate('appointment', 'date time reason');
    } else {
      if (req.user.role === 'doctor') {
        prescriptions = await Prescription.find({ doctor: req.user._id })
          .populate('patient', 'name _id')
          .populate('doctor', 'name specialty _id')
          .populate('appointment', 'date time reason');
      } else {
        prescriptions = await Prescription.find()
          .populate('patient', 'name _id')
          .populate('doctor', 'name specialty _id')
          .populate('appointment', 'date time reason');
      }
    }
    
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name _id')
      .populate('doctor', 'name specialty _id')
      .populate('appointment', 'date time reason');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (req.user.role === 'patient' && prescription.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && prescription.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Only doctors can create prescriptions.' });
    }

    const { appointment, diagnosis, medications } = req.body;

    const appointmentData = await Appointment.findById(appointment);
    if (!appointmentData) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const prescriptionData = {
      appointment,
      diagnosis,
      medications,
      doctor: req.user._id,
      patient: appointmentData.patient
    };

    const prescription = new Prescription(prescriptionData);
    const savedPrescription = await prescription.save();

    const populatedPrescription = await Prescription.findById(savedPrescription._id)
      .populate('patient', 'name _id')
      .populate('doctor', 'name specialty _id')
      .populate('appointment', 'date time reason');

    res.status(201).json(populatedPrescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (req.user.role === 'patient' && prescription.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && prescription.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.keys(req.body).forEach(key => {
      prescription[key] = req.body[key];
    });

    const updatedPrescription = await prescription.save();

    const populatedPrescription = await Prescription.findById(updatedPrescription._id)
      .populate('patient', 'name _id')
      .populate('doctor', 'name specialty _id')
      .populate('appointment', 'date time reason');

    res.status(200).json(populatedPrescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (req.user.role === 'patient' && prescription.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && prescription.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Prescription.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};