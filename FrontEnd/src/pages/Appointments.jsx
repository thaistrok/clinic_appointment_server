import React from 'react';
import { useParams } from 'react-router-dom';
import AppointmentList from '../components/AppointmentList.jsx';
import EditAppointment from './EditAppointment.jsx';
import '../styles/Appointments.css';

const Appointments = () => {
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <div className="appointments-page">
      <div className="appointments-container">
        {isEditing ? (
          <EditAppointment />
        ) : (
          <AppointmentList />
        )}
      </div>
    </div>
  );
};

export default Appointments;