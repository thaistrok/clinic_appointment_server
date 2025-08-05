import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm.jsx';
import { appointmentAPI } from '../services/api.js';
import '../styles/EditAppointment.css';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getAppointment(id);
        setAppointment(response.data);
      } catch (err) {
        setError('Failed to fetch appointment details');
        console.error('Error fetching appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleFormSubmit = async (appointmentData) => {
    try {
      // Update the appointment with the new data
      const response = await appointmentAPI.updateAppointment(id, appointmentData);
      
      // Show success message
      alert('Appointment updated successfully!');
      
      // Navigate back to appointments list
      navigate('/appointments');
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading appointment details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!appointment) {
    return <div className="error-message">Appointment not found</div>;
  }

  return (
    <div className="edit-appointment-page">
      <div className="edit-appointment-container">
        <div className="page-header">
          <h1>Edit Appointment</h1>
          <p>Update your appointment details</p>
        </div>
        <AppointmentForm appointment={appointment} onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default EditAppointment;