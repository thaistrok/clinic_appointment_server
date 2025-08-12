import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth.js';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const user = getCurrentUser();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        
        <div className="dashboard-cards">
          <div className="card">
            <h3>My Appointments</h3>
            <p>View and manage your appointments</p>
            <Link to="/appointments" className="card-button">
              View Appointments
            </Link>
          </div>
          
          <div className="card">
            <h3>Book Appointment</h3>
            <p>Schedule a new appointment with a doctor</p>
            <Link to="/appointments/new" className="card-button">
              Book Now
            </Link>
          </div>
          
          {user?.role === 'doctor' && (
            <div className="card">
              <h3>Doctor Dashboard</h3>
              <p>Manage appointments and create prescriptions</p>
              <Link to="/doctor-dashboard" className="card-button">
                Doctor Dashboard
              </Link>
            </div>
          )}
          
          <div className="card">
            <h3>Update Password</h3>
            <p>Change your account password</p>
            <Link to="/password-update" className="card-button">
              Update Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;