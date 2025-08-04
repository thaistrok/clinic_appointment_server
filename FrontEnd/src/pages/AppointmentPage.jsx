import React, { useState, useEffect } from 'react';
import AppointmentList from '../components/AppointmentList';
import '../styles/AppointmentPage.css';

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would fetch from your backend API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAppointments = [
        {
          _id: '1',
          doctor: { name: 'Smith' },
          date: new Date().toISOString(),
          time: '10:00 AM',
          reason: 'Regular checkup',
          status: 'confirmed'
        },
        {
          _id: '2',
          doctor: { name: 'Johnson' },
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          time: '2:30 PM',
          reason: 'Follow-up consultation',
          status: 'scheduled'
        }
      ];
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBookAppointment = () => {
    console.log('Booking new appointment');
    // In a real app, this would navigate to the appointment booking page
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="appointment-page">
      <div className="page-header">
        <h1>My Appointments</h1>
        <button className="btn btn-primary" onClick={handleBookAppointment}>Book New Appointment</button>
      </div>
      <AppointmentList appointments={appointments} />
    </div>
  );
};

export default AppointmentPage;