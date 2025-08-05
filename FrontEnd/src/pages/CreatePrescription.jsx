import React from 'react';
import PrescriptionForm from '../components/PrescriptionForm.jsx';
import '../styles/CreatePrescription.css';

const CreatePrescription = () => {
  return (
    <div className="create-prescription-page">
      <div className="create-prescription-container">
        <div className="page-header">
          <h1>Create Prescription</h1>
          <p>Fill in the diagnosis and prescribed medications</p>
        </div>
        <PrescriptionForm />
      </div>
    </div>
  );
};

export default CreatePrescription;