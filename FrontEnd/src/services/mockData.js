/**
 * Mock data service for doctors and available time slots
 * In a real application, this would be replaced with actual API calls
 */

// Mock doctors data
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Yousif',
    specialty: 'Node.js_Express.js_React.js_Pytyhon',
    experience: '10 years'
  },
  {
    id: 2,
    name: 'Dr. Michael',
    specialty: 'Express.js_React.js',
    experience: '8 years'
  },
  {
    id: 3,
    name: 'Dr. Omar',
    specialty: 'Python',
    experience: '12 years'
  },
  {
    id: 4,
    name: 'Dr. Mahmooud',
    specialty: 'Node.js',
    experience: '6 years'
  },
  {
    id: 5,
    name: 'Dr. Noor',
    specialty: 'typescript.ts',
    experience: '3 years'
  },
  {
    id: 6,
    name: 'Dr. Denis Dujota',
    specialty: 'Pro_Python',
    experience: '15 years'
  }
];

/**
 * Get list of doctors
 * @returns {Promise<Array>} - Promise that resolves to array of doctors
 */
export const getDoctors = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDoctors;
};

/**
 * Get available time slots for a specific doctor and date
 * @param {number} doctorId - The ID of the doctor
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {Promise<Array>} - Promise that resolves to array of time slots
 */
export const getAvailableSlots = async (doctorId, date) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock time slots for the given date
  const timeSlots = [];
  const startHour = 9; // 9 AM
  const endHour = 17;  // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    // Create two slots per hour: on the hour and half past
    const hourFormatted = hour.toString().padStart(2, '0');
    
    timeSlots.push({
      time: `${hourFormatted}:00`,
      available: Math.random() > 0.3 // 70% chance of being available
    });
    
    timeSlots.push({
      time: `${hourFormatted}:30`,
      available: Math.random() > 0.3 // 70% chance of being available
    });
  }
  
  return timeSlots;
};