import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableSlots } from '../services/mockData';
import { appointmentAPI, userAPI } from '../services/api.js';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const { execute, loading: apiLoading, error: apiError, success } = useApiMutation();

  // Function to format date for input field (converts various date formats to yyyy-MM-dd)
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    
    let dateObj;
    if (typeof dateValue === 'string') {
      // Handle various string formats
      dateObj = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      // Handle Date objects
      dateObj = dateValue;
    } else {
      // Handle other cases
      return '';
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await userAPI.getDoctors();
        setDoctors(response.data);
        if (response.data.length > 0 && !appointment) {
          setDoctor(response.data[0]._id);
        }
      } catch (err) {
        const mockDoctors = [
          { _id: '688f89196d5e34b989bb98af', name: 'Dr. Yousif', specialty: 'Node.js_Express.js_React.js_Pytyhon' },
          { _id: '688f891a6d5e34b989bb98b2', name: 'Dr. Michael', specialty: 'Express.js_React.js' },
          { _id: '688f891a6d5e34b989bb98b5', name: 'Dr. Omar', specialty: 'Python' }
        ];
        setDoctors(mockDoctors);
        if (mockDoctors.length > 0 && !appointment) {
          setDoctor(mockDoctors[0]._id);
        }
      }
    };

    fetchDoctors();

    if (appointment) {
      setDate(formatDateForInput(appointment.date));
      setTime(appointment.time);
      setDoctor(appointment.doctor?._id || '');
      setReason(appointment.reason || '');
    }
  }, [appointment]);

  useEffect(() => {
    if (date && doctor) {
      const fetchSlots = async () => {
        try {
          const slots = await getAvailableSlots(doctor, date);
          setAvailableSlots(slots);
          if (slots.length > 0 && !appointment) {
            setTime(slots[0].time);
          }
        } catch (err) {
          console.error('Error fetching available slots:', err);
          setAvailableSlots([]);
        }
      };
      
      fetchSlots();
    } else {
      setAvailableSlots([]);
      setTime('');
    }
  }, [date, doctor, appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const appointmentData = {
      date,
      time,
      doctor,
      reason,
      patient: user._id
    };

    try {
      let result;
      if (appointment) {
        result = await execute(appointmentAPI.updateAppointment, {
          id: appointment._id,
          ...appointmentData
        });
      } else {
        result = await execute(appointmentAPI.createAppointment, appointmentData);
      }

      if (result.success) {
        if (onSubmit) {
          onSubmit(result.data);
        } else {
          navigate('/appointments');
        }
      }
    } catch (err) {
      setError('Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = date && time && doctor && reason;

  return (
    <div className="appointment-form-container">
      <h2>{appointment ? 'Edit Appointment' : 'Book New Appointment'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {apiError && <div className="error-message">{apiError}</div>}
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="doctor">Doctor:</label>
          <select
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
            disabled={apiLoading}
          >
            <option value="">Select a doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            disabled={apiLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={apiLoading || !date || !doctor}
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot) => (
              <option key={slot.time} value={slot.time}>
                {slot.time}
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
            placeholder="Briefly describe the reason for your visit"
            required
            disabled={apiLoading}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={apiLoading || !isFormValid}
            className="btn btn-primary"
          >
            {apiLoading ? 'Saving...' : (appointment ? 'Update Appointment' : 'Book Appointment')}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/appointments')}
            disabled={apiLoading}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;