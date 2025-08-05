import React from 'react';
import PrescriptionList from '../components/PrescriptionList.jsx';
import '../styles/Prescriptions.css';

const Prescriptions = () => {
  return (
    <div className="prescriptions-page">
      <div className="prescriptions-container">
        <div className="page-header">
          <h1>My Prescriptions</h1>
          <p>View your prescriptions from doctors</p>
        </div>
        <PrescriptionList />
      </div>
    </div>
  );
};

export default Prescriptions;