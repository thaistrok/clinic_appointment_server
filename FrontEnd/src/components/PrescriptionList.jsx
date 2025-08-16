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
      
      
      <div className="prescription-controls">
        <div className="filter-controls">
          </div>
      </div>
      
      {prescriptionsToShow.length === 0 ? (
        <div className="no-prescriptions">
          <p>No prescriptions found.</p>
          {user && user.role === 'doctor' && (
            <Link to="/appointments" className="btn btn-primary">
              View Appointments
            </Link>
          )}
        </div>
      ) : (
        <div className="prescription-grid">
          {prescriptionsToShow.map((prescription) => (
            <div key={prescription._id} className="prescription-card">
              <div className="prescription-header">
                <h3>Prescription</h3>
                <span className="prescription-date">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="prescription-details">
                {prescription.doctor && (
                  <p><strong>Doctor:</strong> {prescription.doctor.name}</p>
                )}
                {prescription.patient && (
                  <p><strong>Patient:</strong> {prescription.patient.name}</p>
                )}
                {prescription.appointment && (
                  <p><strong>Appointment:</strong> {new Date(prescription.appointment.date).toLocaleDateString()} at {prescription.appointment.time}</p>
                )}
                <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
              </div>
              
              <div className="medications-section">
                <h4>Medications</h4>
                {prescription.medications && prescription.medications.length > 0 ? (
                  <ul className="medications-list">
                    {prescription.medications.map((med, index) => (
                      <li key={index} className="medication-item">
                        <strong>{med.name}</strong> - {med.dosage}, {med.frequency}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No medications listed.</p>
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