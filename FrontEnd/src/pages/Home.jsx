import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/auth.js';
import '../styles/Home.css';

const Home = () => {
  const authenticated = isAuthenticated();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Dr.Yousif Clinic</h1>
          <p>Your trusted platform for booking medical appointments</p>
          {!authenticated ? (
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Booking</h3>
              <p>Book appointments with doctors in just a few clicks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Prescription Management</h3>
              <p>View and manage your prescriptions digitally</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Appointment Reminders</h3>
              <p>Get timely reminders for your upcoming appointments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up for a free account on our platform</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book Appointment</h3>
              <p>Choose a doctor and available time slot</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Attend Appointment</h3>
              <p>Visit the clinic at your scheduled time</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Prescription</h3>
              <p>Receive digital prescriptions from doctors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;