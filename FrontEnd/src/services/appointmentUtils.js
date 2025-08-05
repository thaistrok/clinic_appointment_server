/**
 * Validate appointment ID
 * @param {string|number} id - The appointment ID to validate
 * @param {string} action - The action being performed (e.g., 'cancel', 'delete', 'update')
 * @returns {boolean} - True if the ID is valid, false otherwise
 */
export const validateAppointmentId = (id, action) => {
  if (!id) {
    alert('Invalid appointment ID');
    console.error(`Cannot ${action} appointment: ID is missing or invalid`, id);
    return false;
  }
  return true;
};