import React, { useState, useEffect } from 'react';
import PrescriptionList from '../components/PrescriptionList.jsx';
import MedicationDropdown from '../components/MedicationDropdown.jsx';
import { medicationAPI } from '../services/api.js';
import '../styles/Prescriptions.css';

const Prescriptions = () => {
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 
  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
  };

  return (
    <div className="prescriptions-page">
      <div className="prescriptions-container">
        <div className="page-header">
          <h1>My Prescriptions</h1>
          <p>View your prescriptions from doctors</p>
        </div>
        
        <div className="medication-search-section">
          {loading ? (
            <div className="loading-message">
             
            </div>
          ) : (
            <>
             
              {error && (
                <div className="medication-error">
                  <p>{error}</p>
                </div>
              )}
            </>
          )}
        </div>
        
        <PrescriptionList />
      </div>
    </div>
  );
};

export default Prescriptions;