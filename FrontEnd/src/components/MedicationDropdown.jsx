import React, { useState, useEffect } from 'react';
import { medicationAPI } from '../services/api.js';
import '../styles/MedicationDropdown.css';

const MedicationDropdown = ({ 
  value, 
  onChange, 
  onSelect,
  placeholder = "Select medication...",
  className = ""
}) => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedValue, setSelectedValue] = useState(value || '');

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await medicationAPI.getAllMedications();
        setMedications(response.data);
      } catch (err) {
        setError('Failed to load medications');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  useEffect(() => {
    if (value !== selectedValue) {
      setSelectedValue(value || '');
    }
  }, [value, selectedValue]);

  const handleChange = (e) => {
    const selectedMedicationId = e.target.value;
    setSelectedValue(selectedMedicationId);
    
    if (onChange) {
      onChange(e);
    }
    
    if (onSelect) {
      const selectedMedication = medications.find(med => med._id === selectedMedicationId);
      onSelect(selectedMedication);
    }
  };

  return (
    <div className={`medication-dropdown ${className}`}>
      {error && <div className="error-message">{error}</div>}
      
      <select 
        value={selectedValue}
        onChange={handleChange}
        disabled={loading}
        className="medication-select"
      >
        <option value="">{placeholder}</option>
        {medications.map((medication) => (
          <option 
            key={medication._id} 
            value={medication._id}
          >
            {medication.name} - {medication.dosage} - {medication.frequency}
          </option>
        ))}
      </select>
      
      {loading && <div className="loading">Loading medications...</div>}
    </div>
  );
};

export default MedicationDropdown;