import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../services/api.js';
import MedicationDropdown from './MedicationDropdown.jsx';
import '../styles/PrescriptionForm.css';

const PrescriptionForm = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await appointmentAPI.getAppointment(appointmentId);
        setAppointment(response.data);
      } catch (err) {
        setError('Failed to fetch appointment details');
        console.error('Error fetching appointment:', err);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const handleRemoveMedication = (index) => {
    if (medications.length > 1) {
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      setMedications(updatedMedications);
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const handleMedicationSelect = (index, medication) => {
    if (medication) {
      const updatedMedications = [...medications];
      updatedMedications[index].name = medication.name;
      updatedMedications[index].dosage = medication.dosage;
      updatedMedications[index].frequency = medication.frequency;
      setMedications(updatedMedications);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Filter out empty medications
    const filteredMedications = medications.filter(
      med => med.name.trim() || med.dosage.trim() || med.frequency.trim()
    );

    const prescriptionData = {
      appointment: appointmentId,
      diagnosis,
      medications: filteredMedications
    };

    try {
      await prescriptionAPI.createPrescription(prescriptionData);
      setSuccess(true);
      // Redirect to prescriptions page after 2 seconds
      setTimeout(() => {
        navigate('/prescriptions');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  if (!appointment && appointmentId) {
    return <div className="loading">Loading appointment details...</div>;
  }

  return (
    <div className="prescription-form-container">
      <form className="prescription-form" onSubmit={handleSubmit}>
        <h2>Create Prescription</h2>
        
        {appointment && (
          <div className="appointment-info">
            <h3>Appointment Details</h3>
            <p><strong>Patient:</strong> {appointment.patientName}</p>
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Reason:</strong> {appointment.reason}</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Prescription created successfully!</div>}
        
        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
            required
          />
        </div>
        
        <div className="medications-section">
          <h3>Medications</h3>
          {medications.map((med, index) => (
            <div key={index} className="medication-row">
              <div className="medication-select">
                <label>Medication:</label>
                <MedicationDropdown
                  onSelect={(medication) => handleMedicationSelect(index, medication)}
                  placeholder="Select a medication..."
                />
              </div>
              <div className="medication-details">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    placeholder="Medication name"
                  />
                </div>
                <div className="form-group">
                  <label>Dosage:</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    placeholder="Dosage"
                  />
                </div>
                <div className="form-group">
                  <label>Frequency:</label>
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    placeholder="Frequency"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMedication(index)}
                className="remove-btn"
                disabled={medications.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddMedication} className="add-medication-btn">
            Add Medication
          </button>
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;