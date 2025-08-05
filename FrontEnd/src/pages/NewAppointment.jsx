import React from 'react';
import AppointmentForm from '../components/AppointmentForm.jsx';
import '../styles/NewAppointment.css';

const NewAppointment = () => {
  const handleFormSubmit = (appointmentData) => {
    // In a real app, this would save the appointment to a backend
    console.log('Booking appointment:', appointmentData);
    
    // For now, we'll just show an alert to confirm the booking
    alert('Appointment booked successfully!');
  };

  return (
    <div className="new-appointment-page">
      <div className="new-appointment-container">
        <div className="page-header">
          <h1>Book New Appointment</h1>
          <p>Select a date, doctor, and time slot for your appointment</p>
        </div>
        <AppointmentForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default NewAppointment;