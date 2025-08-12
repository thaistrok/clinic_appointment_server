import React from 'react';
import PasswordUpdateForm from '../components/PasswordUpdateForm.jsx';
import '../styles/PasswordUpdate.css';

const PasswordUpdate = () => {
  return (
    <div className="password-update-page">
      <div className="password-update-container">
        <div className="page-header">
        </div>
        <PasswordUpdateForm />
      </div>
    </div>
  );
};

export default PasswordUpdate;