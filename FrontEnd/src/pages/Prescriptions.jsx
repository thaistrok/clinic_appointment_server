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

  // useEffect(() => {
  //   const fetchMedications = async () => {
  //     try {
  //       const response = await medicationAPI.getMedications();
  //       setMedications(response.data);
  //     } catch (err) {
  //       console.error('Error fetching medications:', err);
  //       setError('Failed to load medications');
        
  //       // Fallback medications
  //       const fallbackMedications = [
  //         { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours' },
  //         { name: 'Ibuprofen', dosage: '200mg', frequency: 'Every 8 hours' },
  //         { name: 'Amoxicillin', dosage: '250mg', frequency: 'Every 8 hours' },
  //         { name: 'Metformin', dosage: '500mg', frequency: 'Twice a day' },
  //         { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  //         { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' },
  //         { name: 'Omeprazole', dosage: '40mg', frequency: 'Once daily before breakfast' },
  //         { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily' },
  //         { name: 'Salbutamol', dosage: '100mcg', frequency: 'As needed (max 4 times/day)' },
  //         { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Once daily in the morning' }
  //       ];
  //       setMedications(fallbackMedications);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMedications();
  // }, []);

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
            <p></p>
          ) : (
            <>
              <MedicationDropdown
                medications={medications}
                onSelect={handleMedicationSelect}
                placeholder="Select a medication to view details..."
              />
              
              {selectedMedication && (
                <div className="selected-medication-details">
                  <h3>Medication Details</h3>
                  <div className="medication-info">
                    <p><strong>Name:</strong> {selectedMedication.name}</p>
                    <p><strong>Dosage:</strong> {selectedMedication.dosage}</p>
                    <p><strong>Frequency:</strong> {selectedMedication.frequency}</p>
                  </div>
                </div>
              )}
              
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