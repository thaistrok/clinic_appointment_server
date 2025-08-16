import React from 'react';
import RegistrationForm from '../components/RegistrationForm.jsx';
import '../styles/Register.css';

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-page-content">
        <div className="register-page-header">
          <h1>Welcome to Dr.Yousif Clinic</h1>
          <p>Create a new account to get started</p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Register;