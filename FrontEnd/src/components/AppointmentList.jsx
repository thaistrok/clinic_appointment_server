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
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [sortBy, setSortBy] = useState('date'); // date, status
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
      
      // For doctors, fetch all appointments
      // For patients, fetch only their appointments
      let response;
      if (user && user.role === 'doctor') {
        response = await appointmentAPI.getAppointments();
      } else {
        response = await appointmentAPI.getMyAppointments();
      }
      
      const data = response.data;
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      
      // Handle timeout error specifically
      if (err.code === 'ECONNABORTED' || (err.message && err.message.includes('timeout'))) {
        setError('Server is taking too long to respond. Please check your connection or try again later.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view appointments.');
      } else if (!err.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to fetch appointments. Please try again later.');
      }
      
      // Clear appointments on error to avoid showing stale data
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAndSortedAppointments = () => {
    let filtered = [...appointments];
    
    // Apply filter
    const now = new Date();
    if (filter === 'upcoming') {
      filtered = filtered.filter(app => new Date(app.date) >= now);
    } else if (filter === 'past') {
      filtered = filtered.filter(app => new Date(app.date) < now);
    }
    
    // Apply sorting
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'status') {
      filtered.sort((a, b) => a.status.localeCompare(b.status));
    }
    
    return filtered;
  };

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
    return (
      <div className="error">
        <p>Error: {error}</p>
        <div className="error-actions">
          <button onClick={handleRetry} className="btn btn-primary">
            Retry
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-secondary">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const appointmentsToShow = filteredAndSortedAppointments();

  return (
    <div className="appointment-list">
      <div className="appointment-list-header">
        <h2>{user && user.role === 'doctor' ? 'All Appointments' : 'My Appointments'}</h2>
        {user && user.role === 'patient' && (
          <Link to="/appointments/new" className="btn btn-primary">
            New Appointment
          </Link>
        )}
      </div>
      
      {/* Filter and sort controls */}
      <div className="appointment-controls">
        <div className="filter-controls">
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        
        <div className="sort-controls">
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
      
      {appointmentsToShow.length === 0 ? (
        <div className="no-appointments">
          <p>You don't have any appointments yet.</p>
          {user && user.role === 'patient' && (
            <Link to="/appointments/new" className="btn btn-primary">
              Schedule Your First Appointment
            </Link>
          )}
          <button onClick={handleRetry} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      ) : (
        <div className="appointments-container">
          {appointmentsToShow.map((appointment) => (
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
                {user && user.role === 'doctor' ? (
                  <p><strong>Patient:</strong> {appointment.patientName || (appointment.patient?.name)}</p>
                ) : (
                  <p><strong>Doctor:</strong> {appointment.doctorName || (appointment.doctor?.name)}</p>
                )}
              </div>
              
              <div className="appointment-actions">
                {user && user.role === 'doctor' && (
                  <Link 
                    to={`/prescriptions/create/${appointment._id}`} 
                    className="btn btn-primary"
                  >
                    Create Prescription
                  </Link>
                )}
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