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

export const getDoctors = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDoctors;
};

export const getAvailableSlots = async (doctorId, date) => {

  await new Promise(resolve => setTimeout(resolve, 500));
  
 
  const timeSlots = [];
  const startHour = 9; 
  const endHour = 17;  
  
  for (let hour = startHour; hour < endHour; hour++) {
    
    const hourFormatted = hour.toString().padStart(2, '0');
    
    timeSlots.push({
      time: `${hourFormatted}:00`,
      available: Math.random() > 0.3 
    });
    
    timeSlots.push({
      time: `${hourFormatted}:30`,
      available: Math.random() > 0.3
    });
  }
  
  return timeSlots;
};