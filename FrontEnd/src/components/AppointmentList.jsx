import React from 'react';
import '../styles/AppointmentList.css';

const AppointmentList = ({ appointments }) => {
  const formatDateTime = (date, time) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return `${formattedDate} at ${time}`;
  };

  const handleViewDetails = (appointmentId) => {
    console.log('Viewing details for appointment:', appointmentId);
    // In a real app, this would navigate to the appointment details page
  };

  const handleReschedule = (appointmentId) => {
    console.log('Rescheduling appointment:', appointmentId);
    // In a real app, this would open a reschedule modal or navigate to reschedule page
  };

  const handleCancel = (appointmentId) => {
    console.log('Canceling appointment:', appointmentId);
    // In a real app, this would show a confirmation and then cancel the appointment
  };

  return (
    <div className="appointment-list">
      <h2>My Appointments</h2>
      {appointments && appointments.length > 0 ? (
        <div className="appointments">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>Appointment with Dr. {appointment.doctor?.name}</h3>
                <span className={`status ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-details">
                <p><strong>Date & Time:</strong> {formatDateTime(appointment.date, appointment.time)}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
              </div>
              <div className="appointment-actions">
                <button className="btn btn-secondary" onClick={() => handleViewDetails(appointment._id)}>View Details</button>
                <button className="btn btn-warning" onClick={() => handleReschedule(appointment._id)}>Reschedule</button>
                <button className="btn btn-danger" onClick={() => handleCancel(appointment._id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-appointments">You have no appointments scheduled.</p>
      )}
    </div>
  );
};

export default AppointmentList;