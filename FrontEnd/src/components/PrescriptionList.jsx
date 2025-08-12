import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { prescriptionAPI } from '../services/api.js';
import { getCurrentUser } from '../services/auth.js';
import '../styles/PrescriptionList.css';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, recent
  const user = getCurrentUser();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      let response;
      
      // For doctors, fetch all prescriptions
      // For patients, fetch only their prescriptions
      if (user && user.role === 'doctor') {
        response = await prescriptionAPI.getPrescriptions();
      } else {
        response = await prescriptionAPI.getPrescriptions();
      }
      
      setPrescriptions(response.data);
    } catch (err) {
      setError('Failed to fetch prescriptions');
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = () => {
    let filtered = [...prescriptions];
    
    // Filter based on user role
    if (user && user.role === 'doctor') {
      // Doctors see prescriptions they've written
      filtered = filtered.filter(prescription => 
        prescription.doctor && prescription.doctor._id === user.id
      );
    } else if (user) {
      // Patients see prescriptions for them
      filtered = filtered.filter(prescription => 
        prescription.patient && prescription.patient._id === user.id
      );
    }
    
    // Apply additional filters
    if (filter === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(prescription => new Date(prescription.createdAt) >= oneMonthAgo);
    }
    
    return filtered;
  };

  if (loading) {
    return <div className="loading">Loading prescriptions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const prescriptionsToShow = filteredPrescriptions();

  return (
    <div className="prescription-list-container">
      <div className="prescription-list-header">
        <h2>{user && user.role === 'doctor' ? 'Prescriptions I\'ve Written' : 'My Prescriptions'}</h2>
      </div>
      
      {/* Filter controls */}
      <div className="prescription-controls">
        <div className="filter-controls">
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Prescriptions</option>
            <option value="recent">Last 30 Days</option>
          </select>
        </div>
      </div>
      
      {prescriptionsToShow.length === 0 ? (
        <div className="no-prescriptions">
          <p>No prescriptions found.</p>
          {user && user.role === 'doctor' && (
            <p>Create prescriptions from the appointments page.</p>
          )}
        </div>
      ) : (
        <div className="prescriptions-grid">
          {prescriptionsToShow.map((prescription) => (
            <div key={prescription._id} className="prescription-card">
              <div className="prescription-header">
                {user && user.role === 'doctor' ? (
                  <h3>Prescription for {prescription.patient.name}</h3>
                ) : (
                  <h3>Prescription from Dr. {prescription.doctor.name}</h3>
                )}
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
                {user && user.role === 'doctor' && (
                  <p>Patient: {prescription.patient.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;