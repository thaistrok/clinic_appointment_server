import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
  },
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
  getProfile: () => api.get('/auth/profile'),
};

// User API calls
export const userAPI = {
  getAllUsers: () => api.get('/users'), // Admin only
  getDoctors: () => api.get('/users/doctors'),
  addDoctor: (doctorData) => api.post('/users/doctor', doctorData), // Admin only
  getMyAppointments: () => api.get('/users/appointments'), // Doctor/Patient only
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`), // Admin only
};

// Appointment API calls
export const appointmentAPI = {
  getAppointments: () => api.get('/appointments'),
  getMyAppointments: () => api.get('/appointments/my'), // Added method for fetching user's own appointments
  getAppointment: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

// Prescription API calls
export const prescriptionAPI = {
  getPrescriptions: () => api.get('/prescriptions'),
  getPrescription: (id) => api.get(`/prescriptions/${id}`),
  createPrescription: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  updatePrescription: (id, prescriptionData) => api.put(`/prescriptions/${id}`, prescriptionData),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
};

// Medication API calls
export const medicationAPI = {
  getMedications: () => api.get('/medications'),
  getMedication: (id) => api.get(`/medications/${id}`),
  createMedication: (medicationData) => api.post('/medications', medicationData),
  updateMedication: (id, medicationData) => api.put(`/medications/${id}`, medicationData),
  deleteMedication: (id) => api.delete(`/medications/${id}`),
};

export default api;