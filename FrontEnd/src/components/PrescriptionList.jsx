import React, { useState, useEffect } from 'react';
import { prescriptionAPI } from '../services/api.js';
import '../styles/PrescriptionList.css';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await prescriptionAPI.getPrescriptions();
      setPrescriptions(response.data);
    } catch (err) {
      setError('Failed to fetch prescriptions');
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading prescriptions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="prescription-list-container">
      <div className="prescription-list-header">
        <h2>My Prescriptions</h2>
      </div>
      
      {prescriptions.length === 0 ? (
        <div className="no-prescriptions">
          <p>You don't have any prescriptions yet.</p>
        </div>
      ) : (
        <div className="prescriptions-grid">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="prescription-card">
              <div className="prescription-header">
                <h3>Prescription from Dr. {prescription.doctor.name}</h3>
                <span className="prescription-date">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="prescription-details">
                <div className="diagnosis-section">
                  <h4>Diagnosis</h4>
                  <p>{prescription.diagnosis}</p>
                </div>
                
                <div className="medications-section">
                  <h4>Medications</h4>
                  {prescription.medications && prescription.medications.length > 0 ? (
                    <ul className="medications-list">
                      {prescription.medications.map((med, index) => (
                        <li key={`${prescription._id}-med-${index}`} className="medication-item">
                          <div className="medication-name">{med.name}</div>
                          <div className="medication-details">
                            <span>Dosage: {med.dosage}</span>
                            <span>Frequency: {med.frequency}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No medications prescribed</p>
                  )}
                </div>
              </div>
              
              <div className="prescription-footer">
                <p>Appointment Date: {new Date(prescription.appointment.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;