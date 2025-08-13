import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm.jsx';
import { appointmentAPI } from '../services/api.js';
import { isAuthenticated } from '../services/auth.js';
import '../styles/EditAppointment.css';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!id) {
          throw new Error('No appointment ID provided');
        }
        
        const response = await appointmentAPI.getAppointment(id);
        setAppointment(response.data);
      } catch (err) {
        console.error('Error fetching appointment:', err);
        if (err.response?.status === 401) {
          // Token might be expired, redirect to login
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('Appointment not found');
        } else {
          setError('Failed to fetch appointment details: ' + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, navigate]);

  const handleFormSubmit = async (appointmentData) => {
    try {
      // Update the appointment with the new data
      const response = await appointmentAPI.updateAppointment(id, appointmentData);
      
      // Show success message
      alert('Appointment updated successfully!');
      
      // Navigate back to appointments list
      navigate('/appointments');
    } catch (err) {
      console.error('Error updating appointment:', err);
      if (err.response?.status === 401) {
        // Token might be expired, redirect to login
        navigate('/login');
      } else {
        const errorMessage = 'Failed to update appointment: ' + (err.response?.data?.message || err.message);
        setError(errorMessage);
        alert(errorMessage);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading appointment details...</div>;
  }

  if (error) {
    return (
      <div className="edit-appointment-page">
        <div className="edit-appointment-container">
          <div className="error-message">
            {error}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => navigate('/appointments')} className="btn btn-secondary">
                Back to Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="edit-appointment-page">
        <div className="edit-appointment-container">
          <div className="error-message">
            Appointment not found
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => navigate('/appointments')} className="btn btn-secondary">
                Back to Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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