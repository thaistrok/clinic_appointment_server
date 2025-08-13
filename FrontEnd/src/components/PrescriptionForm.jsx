import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../services/api.js';
import MedicationDropdown from './MedicationDropdown.jsx';
import '../styles/PrescriptionForm.css';

const PrescriptionForm = ({ appointmentId: propAppointmentId }) => {
  const { appointmentId: paramAppointmentId } = useParams();
  const actualAppointmentId = propAppointmentId || paramAppointmentId;
  
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
        const response = await appointmentAPI.getAppointment(actualAppointmentId);
        setAppointment(response.data);
      } catch (err) {
        setError('Failed to fetch appointment details');
        console.error('Error fetching appointment:', err);
      }
    };

    if (actualAppointmentId) {
      fetchAppointment();
    }
  }, []);

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

    // Validate form
    if (!actualAppointmentId) {
      setError('No appointment selected');
      setLoading(false);
      return;
    }

    if (!diagnosis.trim()) {
      setError('Please enter a diagnosis');
      setLoading(false);
      return;
    }

    // Check if all medications have names
    const hasIncompleteMedication = medications.some(
      med => !med.name.trim()
    );

    if (hasIncompleteMedication) {
      setError('Please select a medication for each entry');
      setLoading(false);
      return;
    }

    try {
      const prescriptionData = {
        appointment: actualAppointmentId,
        diagnosis,
        medications
      };

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

  if (!appointment && actualAppointmentId) {
    return <div className="loading">Loading appointment details...</div>;
  }

  return (
    <div className="prescription-form-container">
      <form className="prescription-form" onSubmit={handleSubmit}>
        <h2>Create Prescription</h2>
        
        {appointment && (
          <div className="appointment-details">
            <h3>Appointment Details</h3>
            <p><strong>Patient:</strong> {appointment.patient?.name || 'Unknown Patient'}</p>
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Reason:</strong> {appointment.reason}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
            className="form-control"
            rows="4"
            required
          />
        </div>

        <div className="medications-section">
          <label>Medications:</label>
          {medications.map((med, index) => (
            <div key={index} className="medication-row">
              <div className="medication-fields">
                <div className="medication-dropdown">
                  <MedicationDropdown
                    onSelect={(medication) => handleMedicationSelect(index, medication)}
                    placeholder="Select a medication..."
                    className="form-control"
                  />
                </div>
                <div className="medication-details">
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 10mg)"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    className="form-control dosage-input"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g., Twice daily)"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    className="form-control frequency-input"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMedication(index)}
                className="remove-medication-button"
                disabled={medications.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMedication}
            className="add-medication-button"
          >
            Add Medication
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}
        {success && (
          <div className="success-message">Prescription created successfully!</div>
        )}

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || !actualAppointmentId}
        >
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;