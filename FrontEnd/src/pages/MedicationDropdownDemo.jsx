import React, { useState } from 'react';
import MedicationDropdown from '../components/MedicationDropdown';
import '../styles/MedicationDropdownDemo.css';

const MedicationDropdownDemo = () => {
  // Sample medication data
  const sampleMedications = [
    { _id: '1', name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours' },
    { _id: '2', name: 'Ibuprofen', dosage: '200mg', frequency: 'Every 8 hours' },
    { _id: '3', name: 'Amoxicillin', dosage: '250mg', frequency: 'Every 8 hours' },
    { _id: '4', name: 'Metformin', dosage: '500mg', frequency: 'Twice a day' },
    { _id: '5', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
    { _id: '6', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' },
    { _id: '7', name: 'Omeprazole', dosage: '40mg', frequency: 'Once daily before breakfast' },
    { _id: '8', name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily' },
    { _id: '9', name: 'Salbutamol', dosage: '100mcg', frequency: 'As needed (max 4 times/day)' },
    { _id: '10', name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Once daily in the morning' }
  ];

  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medications, setMedications] = useState(sampleMedications);
  const [showForm, setShowForm] = useState(false);

  // Handle medication selection
  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
  };

  // Add a new medication to the list
  const addMedication = () => {
    const newMedication = {
      _id: (medications.length + 1).toString(),
      name: 'New Medication',
      dosage: '10mg',
      frequency: 'Once daily'
    };
    setMedications([...medications, newMedication]);
  };

  // Clear all medications
  const clearMedications = () => {
    setMedications([]);
    setSelectedMedication(null);
  };

  // Reset to sample medications
  const resetMedications = () => {
    setMedications(sampleMedications);
    setSelectedMedication(null);
  };

  return (
    <div className="demo-container">
      <h1>Medication Dropdown Demo</h1>
      
      <div className="demo-section">
        <h2>Basic Usage</h2>
        <p>Select a medication from the dropdown below:</p>
        
        <MedicationDropdown 
          medications={medications}
          onSelect={handleMedicationSelect}
          placeholder="Choose a medication..."
        />
        
        {selectedMedication && (
          <div className="selected-medication">
            <h3>Selected Medication:</h3>
            <p><strong>Name:</strong> {selectedMedication.name}</p>
            <p><strong>Dosage:</strong> {selectedMedication.dosage}</p>
            <p><strong>Frequency:</strong> {selectedMedication.frequency}</p>
          </div>
        )}
      </div>
      
      <div className="demo-section">
        <h2>Testing Scenarios</h2>
        
        <div className="button-group">
          <button onClick={addMedication}>Add Medication</button>
          <button onClick={clearMedications}>Clear All Medications</button>
          <button onClick={resetMedications}>Reset to Sample</button>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Show Form Example'}
          </button>
        </div>
        
        {showForm && (
          <div className="form-example">
            <h3>Prescription Form Example</h3>
            <form>
              <div className="form-group">
                <label>Patient Name:</label>
                <input type="text" placeholder="Enter patient name" />
              </div>
              
              <div className="form-group">
                <label>Medication:</label>
                <MedicationDropdown 
                  medications={medications}
                  onSelect={handleMedicationSelect}
                  placeholder="Select medication"
                />
              </div>
              
              <div className="form-group">
                <label>Instructions:</label>
                <textarea placeholder="Enter special instructions"></textarea>
              </div>
              
              <button type="submit">Submit Prescription</button>
            </form>
          </div>
        )}
      </div>
      
      <div className="demo-section">
        <h2>Edge Cases</h2>
        
        <h3>Empty Medication List:</h3>
        <MedicationDropdown 
          medications={[]}
          onSelect={handleMedicationSelect}
          placeholder="No medications available"
        />
        
        <h3>Disabled Dropdown:</h3>
        <MedicationDropdown 
          medications={medications}
          onSelect={handleMedicationSelect}
          placeholder="This dropdown is disabled"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default MedicationDropdownDemo;