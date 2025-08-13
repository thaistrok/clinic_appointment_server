export const validateAppointmentId = (id, action) => {
  if (!id) {
    alert('Invalid appointment ID');
    console.error(`Cannot ${action} appointment: ID is missing or invalid`, id);
    return false;
  }
  return true;
};