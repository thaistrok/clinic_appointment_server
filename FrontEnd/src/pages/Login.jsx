import React from 'react';
import LoginForm from '../components/LoginForm.jsx';
import '../styles/Login.css';

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-page-content">
        <div className="login-page-header">
          <h1>Welcome to Dr.Yousif Clinic</h1>
          <p>Please sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;