import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../services/api.js';
import MedicationDropdown from '../components/MedicationDropdown.jsx';
import { getCurrentUser, isAuthenticated } from '../services/auth.js';
import '../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState('');
  const [prescriptionError, setPrescriptionError] = useState('');
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'doctor') {
      navigate('/dashboard');
      return;
    }
  }, [authenticated, user, navigate]);

  useEffect(() => {
    // Only fetch appointments if user is authenticated and is a doctor
    if (!authenticated || !user || user.role !== 'doctor') {
      return;
    }
    
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await appointmentAPI.getAppointments();
        // Since the backend already filters appointments by doctor,
        // we can use the response data directly
        setAppointments(response.data);
      } catch (err) {
        // Handle timeout errors specifically
        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          setError('Request timeout. The server is taking too long to respond. Please try again.');
        } else {
          setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
        }
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    
    if (!selectedAppointment) {
      setPrescriptionError('Please select an appointment');
      return;
    }
    
    if (!diagnosis.trim()) {
      setPrescriptionError('Please enter a diagnosis');
      return;
    }
    
    // Check if all medications have names
    const hasIncompleteMedication = medications.some(
      med => !med.name.trim()
    );

    if (hasIncompleteMedication) {
      setPrescriptionError('Please select a medication for each entry');
      return;
    }
    
    try {
      const prescriptionData = {
        appointment: selectedAppointment._id,
        diagnosis,
        medications
      };

      await prescriptionAPI.createPrescription(prescriptionData);
      setPrescriptionSuccess('Prescription created successfully!');
      setPrescriptionError('');
      
      // Reset form
      setDiagnosis('');
      setMedications([{ name: '', dosage: '', frequency: '' }]);
      
      // Redirect to prescriptions page after 2 seconds
      setTimeout(() => {
        navigate('/prescriptions');
      }, 2000);
    } catch (err) {
      setPrescriptionError(err.response?.data?.message || 'Failed to create prescription');
      setPrescriptionSuccess('');
    }
  };

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

  const handleCreatePrescriptionClick = () => {
    if (!selectedAppointment) {
      setPrescriptionError('Please select an appointment first');
      return;
    }
    
    // Navigate to the CreatePrescription page with the selected appointment ID
    navigate(`/prescriptions/create/${selectedAppointment._id}`);
  };

  const handleRetry = () => {
    // Clear error and trigger a new fetch
    setError('');
    // This will trigger the useEffect to run again
    setLoading(true);
  };

  // Don't render anything if not authenticated or not a doctor
  if (!authenticated || !user || user.role !== 'doctor') {
    return <div className="doctor-dashboard">Loading...</div>;
  }

  if (loading) {
    return <div className="doctor-dashboard">Loading appointments...</div>;
  }

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <hr className="dashboard-divider" />
      </div>

      <div className="dashboard-content">
        <div className="appointments-section">
          <h2>Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p>No upcoming appointments.</p>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className={`appointment-item ${
                    selectedAppointment?._id === appointment._id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="appointment-info">
                    <h3>
                      {appointment.patient?.name || 'Unknown Patient'}
                    </h3>
                    <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                    <p>Time: {appointment.time}</p>
                    <p>Reason: {appointment.reason}</p>
                  </div>
                  <div className="appointment-status">
                    <span className={`status ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="prescription-section">
          <h2>Create Prescription</h2>
          {selectedAppointment ? (
            <div>
             
              <form onSubmit={handleCreatePrescription} className="prescription-form">
                <div className="form-group">
                  <label>Patient:</label>
                  <input 
                    type="text" 
                    value={selectedAppointment.patient?.name || 'Unknown Patient'} 
                    readOnly 
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label>Diagnosis:</label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter diagnosis"
                    className="form-control"
                    rows="3"
                    required
                  />
                </div>
                
                <div className="medications-section">
                  <label>Medications:</label>
                  {medications.map((med, index) => (
                    <div key={index} className="medication-row">
                      <div className="medication-dropdown">
                        <MedicationDropdown
                          onSelect={(medication) => handleMedicationSelect(index, medication)}
                          placeholder="Select a medication..."
                          className="form-control"
                        />
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
                
                {prescriptionError && (
                  <div className="error-message">{prescriptionError}</div>
                )}
                {prescriptionSuccess && (
                  <div className="success-message">{prescriptionSuccess}</div>
                )}
                
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Prescription'}
                </button>
              </form>
            </div>
          ) : (
            <p>Please select an appointment to create a prescription</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;