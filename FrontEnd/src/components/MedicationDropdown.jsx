import React, { useState, useEffect } from 'react';
import { medicationAPI } from '../services/api.js';
import '../styles/MedicationDropdown.css';

/**
 * MedicationDropdown Component
 * A dropdown select component for medications with name, dosage, and frequency
 * 
 * @param {Object} props
 * @param {string} [props.value] - The current selected value
 * @param {Function} [props.onChange] - Callback function when selection changes
 * @param {Function} [props.onSelect] - Callback function when a medication is selected
 * @param {string} [props.placeholder="Select medication..."] - Placeholder text for the dropdown
 * @param {string} [props.className=""] - Additional CSS class names
 * @param {boolean} [props.includeInput=false] - Whether to include an input field
 */
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
        const response = await medicationAPI.getMedications();
        setMedications(response.data);
      } catch (err) {
        setError('Failed to load medications');
        console.error('Error fetching medications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedValue(selectedValue);
    onChange && onChange(selectedValue);
    
    if (onSelect && selectedValue) {
      const selectedMedication = medications.find(
        med => `${med.name} (${med.dosage})` === selectedValue
      );
      onSelect(selectedMedication);
    }
  };

  if (loading) {
    return (
      <select className={`medication-dropdown ${className}`} disabled>
        <option>Loading medications...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select className={`medication-dropdown ${className}`} disabled>
        <option>Error loading medications</option>
      </select>
    );
  }

  return (
    <select 
      value={value || ''} 
      onChange={handleChange} 
      className={`medication-dropdown ${className}`}
      disabled={loading}
    >
      <option value="">{placeholder}</option>
      {medications.map((medication) => (
        <option 
          key={medication._id} 
          value={`${medication.name} (${medication.dosage})`}
        >
          {medication.name} ({medication.dosage}) - {medication.frequency}
        </option>
      ))}
    </select>
  );
};

export default MedicationDropdown;