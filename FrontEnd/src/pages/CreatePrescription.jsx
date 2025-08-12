import React from 'react';
import { useParams } from 'react-router-dom';
import PrescriptionForm from '../components/PrescriptionForm.jsx';
import '../styles/CreatePrescription.css';

const CreatePrescription = () => {
  const { appointmentId } = useParams();

  return (
    <div className="create-prescription-page">
      <div className="create-prescription-container">
        <div className="page-header">
          <h1>Create Prescription</h1>
          <p>Fill in the diagnosis and prescribed medications</p>
        </div>
        {appointmentId ? (
          <PrescriptionForm appointmentId={appointmentId} />
        ) : (
          <div className="error-message">
            No appointment selected. Please select an appointment to create a prescription.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePrescription;