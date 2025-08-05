import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api.js';
import { getCurrentUser } from '../services/auth.js';
import { validateAppointmentId } from '../services/appointmentUtils.js';
import '../styles/AppointmentList.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      // Use the correct endpoint for fetching user's own appointments
      const response = await appointmentAPI.getMyAppointments();
      const data = response.data;
      
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = async (id) => {
    // Validate the ID before proceeding
    if (!validateAppointmentId(id, 'cancel')) {
      return;
    }
    
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.deleteAppointment(id);
        // Remove the cancelled appointment from the list
        setAppointments(appointments.filter(app => app._id !== id));
      } catch (err) {
        alert('Failed to cancel appointment');
        console.error('Error cancelling appointment:', err);
      }
    }
  };

  const handleDeleteAppointment = async (id) => {
    // Add debugging to check the ID value
    console.log('Attempting to delete appointment with ID:', id);
    
    // Check if ID is valid
    if (!validateAppointmentId(id, 'delete')) {
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        await appointmentAPI.deleteAppointment(id);
        // Remove the deleted appointment from the list
        setAppointments(appointments.filter(app => app._id !== id));
        alert('Appointment deleted successfully');
      } catch (err) {
        alert('Failed to delete appointment');
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const handleEdit = (id) => {
    // Validate the ID before proceeding
    if (!validateAppointmentId(id, 'update')) {
      return;
    }
    
    // Navigate to the edit page
    navigate(`/appointments/${id}/edit`);
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="appointment-list">
      <div className="appointment-list-header">
        <h2>My Appointments</h2>
        <Link to="/appointments/new" className="btn btn-primary">
          New Appointment
        </Link>
      </div>
      
      {appointments.length === 0 ? (
        <div className="no-appointments">
          <p>You don't have any appointments yet.</p>
          <Link to="/appointments/new" className="btn btn-primary">
            Schedule Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="appointments-container">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-details">
                <h3>Appointment #{appointment._id?.substring(0, 8)}</h3>
                <p><strong>Date & Time:</strong> {formatDate(`${appointment.date}T${appointment.time}`)}</p>
                <p><strong>Status:</strong> 
                  <span className={`status ${appointment.status?.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
                <p><strong>Doctor:</strong> {appointment.doctorName || (appointment.doctor?.name)}</p>
              </div>
              
              <div className="appointment-actions">
                <button 
                  onClick={() => handleEdit(appointment._id)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteAppointment(appointment._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;