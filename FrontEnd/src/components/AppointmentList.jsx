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
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
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

  const handleRetry = () => {
    fetchAppointments();
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await appointmentAPI.getAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDelete = async (id) => {
    if (!validateAppointmentId(id)) {
      setError('Invalid appointment ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.deleteAppointment(id);
        setAppointments(appointments.filter(app => app._id !== id));
      } catch (err) {
        setError('Failed to delete appointment. Please try again.');
      }
    }
  };

  const handleEdit = (id) => {
    if (!validateAppointmentId(id)) {
      setError('Invalid appointment ID');
      return;
    }
    navigate(`/appointments/${id}/edit`);
  };

  const handleCreatePrescription = (appointment) => {
    navigate('/prescriptions/create', { state: { appointment } });
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'upcoming') {
      return new Date(app.date + 'T' + app.time) > new Date();
    }
    if (filter === 'past') {
      return new Date(app.date + 'T' + app.time) < new Date();
    }
    return true;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="appointment-list-container">
      <div className="appointment-list-header">
        <h2>My Appointments</h2>
        <Link to="/appointments/new" className="btn btn-primary">
          Book New Appointment
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="filters">
        <div className="filter-group"> 
        </div><div className="filter-group">
        </div>
      </div>

      {sortedAppointments.length === 0 ? (
        <div className="no-appointments">
          <p>No appointments found.</p>
          <Link to="/appointments/new" className="btn btn-primary">
            Book Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="appointments-list">
          {sortedAppointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.doctor?.name || 'Doctor'}</h3>
                <span className={`status ${getStatusClass(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="appointment-details">
                <p><strong>Date:</strong> {formatDate(`${appointment.date}T${appointment.time}`)}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
              </div>
              
              <div className="appointment-actions">
                <button 
                  onClick={() => handleEdit(appointment._id)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
                
                <button 
                  onClick={() => handleDelete(appointment._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
                
                
                
                <Link 
                  to={`/prescriptions?appointmentId=${appointment._id}`}
                  className="btn btn-info"
                >
                  View Prescriptions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;