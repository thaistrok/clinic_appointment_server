import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../services/api.js';
import MedicationDropdown from '../components/MedicationDropdown.jsx';
import { getCurrentUser } from '../services/auth.js';
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
  const user = getCurrentUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getAppointments();
        // Filter appointments for this doctor
        const doctorAppointments = response.data.filter(
          appointment => appointment.doctor._id === user._id || appointment.doctor === user._id
        );
        setAppointments(doctorAppointments);
      } catch (err) {
        setError('Failed to fetch appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user._id]);

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
    
    // Filter out empty medications
    const validMedications = medications.filter(
      med => med.name.trim() || med.dosage.trim() || med.frequency.trim()
    );
    
    if (validMedications.length === 0) {
      setPrescriptionError('Please add at least one medication');
      return;
    }

    try {
      setPrescriptionError('');
      const prescriptionData = {
        appointment: selectedAppointment._id || selectedAppointment,
        doctor: user._id,
        patient: selectedAppointment.patient._id || selectedAppointment.patient,
        diagnosis,
        medications: validMedications
      };

      await prescriptionAPI.createPrescription(prescriptionData);
      setPrescriptionSuccess('Prescription created successfully!');
      setDiagnosis('');
      setMedications([{ name: '', dosage: '', frequency: '' }]);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPrescriptionSuccess('');
      }, 3000);
    } catch (err) {
      setPrescriptionError('Failed to create prescription');
      console.error('Error creating prescription:', err);
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

  if (loading) {
    return <div className="doctor-dashboard">Loading appointments...</div>;
  }

  if (error) {
    return <div className="doctor-dashboard">Error: {error}</div>;
  }

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome, Dr. {user?.name || 'Doctor'}!</p>
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
                    </div>
                    <div className="medication-inputs">
                      <input
                        type="text"
                        placeholder="Name"
                        value={med.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        className="form-control"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        className="form-control"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="btn btn-danger"
                      disabled={medications.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="btn btn-secondary"
                >
                  Add Medication
                </button>
              </div>
              
              {prescriptionError && (
                <div className="alert alert-danger">{prescriptionError}</div>
              )}
              
              {prescriptionSuccess && (
                <div className="alert alert-success">{prescriptionSuccess}</div>
              )}
              
              <button type="submit" className="btn btn-primary">
                Create Prescription
              </button>
            </form>
          ) : (
            <p>Please select an appointment to create a prescription.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;