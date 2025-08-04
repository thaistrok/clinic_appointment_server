import React from 'react';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Welcome to Clinic Appointment System</h1>
        <p>Manage your medical appointments easily and efficiently</p>
      </header>

      <section className="features">
        <div className="feature">
          <h2>Easy Booking</h2>
          <p>Book appointments with doctors in just a few clicks</p>
        </div>
        <div className="feature">
          <h2>Manage Appointments</h2>
          <p>View, update, or cancel your appointments anytime</p>
        </div>
        <div className="feature">
          <h2>Find Doctors</h2>
          <p>Browse our list of qualified doctors and specialists</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;