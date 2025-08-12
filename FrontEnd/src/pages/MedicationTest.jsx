import React, { useState } from 'react';
import MedicationDropdown from '../components/MedicationDropdown';

const MedicationTest = () => {
  const [selectedMedication, setSelectedMedication] = useState(null);
  
  // Sample medication data
  const medications = [
    { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours' },
    { name: 'Ibuprofen', dosage: '200mg', frequency: 'Every 8 hours' },
    { name: 'Amoxicillin', dosage: '250mg', frequency: 'Every 8 hours' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice a day' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
  ];

  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Medication Dropdown Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Select a Medication</h2>
        <MedicationDropdown
          medications={medications}
          onSelect={handleMedicationSelect}
          placeholder="Choose a medication..."
        />
      </div>
      
      {selectedMedication && (
        <div style={{ 
          backgroundColor: '#e9f7ef', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #d4edda'
        }}>
          <h3>Selected Medication:</h3>
          <p><strong>Name:</strong> {selectedMedication.name}</p>
          <p><strong>Dosage:</strong> {selectedMedication.dosage}</p>
          <p><strong>Frequency:</strong> {selectedMedication.frequency}</p>
        </div>
      )}
    </div>
  );
};

export default MedicationTest;