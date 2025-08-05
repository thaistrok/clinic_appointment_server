import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors, getAvailableSlots } from '../services/mockData';
import { appointmentAPI } from '../services/api.js';
import { useApiMutation } from '../hooks/useApi.js';
import { getCurrentUser } from '../services/auth.js';
import '../styles/AppointmentForm.css';

const AppointmentForm = ({ appointment, onSubmit }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const { execute, loading, error: apiError, success } = useApiMutation();

  useEffect(() => {
    // Fetch doctors list
    const fetchDoctors = async () => {
      try {
        setDoctors(response);
        if (response.length > 0 && !appointment) {
          setDoctor(response[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      }
    };

    fetchDoctors();

    // If editing an appointment, populate the form
    if (appointment) {
      setDate(appointment.date);
      setTime(appointment.time);
      setDoctor(appointment.doctorId.toString());
      setReason(appointment.reason);
    }
  }, [appointment]);

  useEffect(() => {
    // Fetch available slots when date or doctor changes
    const fetchAvailableSlots = async () => {
      if (date && doctor) {
        try {
          setAvailableSlots(response);
          // Reset time selection when slots change
          setTime('');
        } catch (err) {
          console.error('Failed to fetch available slots', err);
        }
      } else {
        // Clear available slots and time selection when date or doctor is cleared
        setAvailableSlots([]);
        setTime('');
      }
    };

    fetchAvailableSlots();
  }, [date, doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that all required fields are filled
    if (!date || !time || !doctor || !reason) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Prepare appointment data
      const appointmentData = {
        date,
        time,
        doctorId: doctor,
        reason
      };

      // Add patient information if available
      if (user && user.id) {
        appointmentData.patientId = user.id;
        appointmentData.patientName = user.name;
      }

      // Add doctor name
      const selectedDoctor = doctors.find(doc => doc.id.toString() === doctor);
      if (selectedDoctor) {
        appointmentData.doctorName = selectedDoctor.name;
      }

      // Add default status
      appointmentData.status = 'CONFIRMED';

      // Call the API
      const result = await execute(
        appointment 
          ? appointmentAPI.updateAppointment.bind(null, appointment._id) 
          : appointmentAPI.createAppointment,
        appointmentData
      );

      if (result.success) {
        // Navigate to appointments page on success
        navigate('/appointments');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form-container">
      <form className="appointment-form" onSubmit={handleSubmit}>
        <h2>{appointment ? 'Edit Appointment' : 'Book New Appointment'}</h2>
        
        {(error || apiError) && <div className="error-message">{error || apiError}</div>}
        
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="doctor">Doctor:</label>
          <select
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={!date || !doctor}
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot) => (
              <option key={`${date}-${doctor}-${slot.time}`} value={slot.time} disabled={!slot.available}>
                {slot.time} ({slot.available ? 'Available' : 'Booked'})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="reason">Reason for visit:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="Briefly describe the reason for your visit"
            rows="4"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/appointments')}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : (appointment ? 'Update Appointment' : 'Book Appointment')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;