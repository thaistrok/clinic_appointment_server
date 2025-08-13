import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => Promise.resolve(),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
  getProfile: () => api.get('/auth/profile'),
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getDoctors: () => api.get('/users/doctors'),
  addDoctor: (doctorData) => api.post('/users/doctor', doctorData),
  getMyAppointments: () => api.get('/users/appointments'),
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const appointmentAPI = {
  getAppointments: () => api.get('/appointments'),
  getMyAppointments: () => api.get('/appointments/my'),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  updateAppointment: ({ id, ...appointmentData }) => api.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

export const prescriptionAPI = {
  getPrescriptions: () => api.get('/prescriptions'),
  getPrescription: (id) => api.get(`/prescriptions/${id}`),
  createPrescription: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  updatePrescription: ({ id, ...prescriptionData }) => api.put(`/prescriptions/${id}`, prescriptionData),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
  getPrescriptionsByAppointment: (appointmentId) => api.get(`/prescriptions/appointment/${appointmentId}`),
};

export const medicationAPI = {
  getAllMedications: () => api.get('/medications'),
  getMedication: (id) => api.get(`/medications/${id}`),
  createMedication: (medicationData) => api.post('/medications', medicationData),
  updateMedication: ({ id, ...medicationData }) => api.put(`/medications/${id}`, medicationData),
  deleteMedication: (id) => api.delete(`/medications/${id}`),
};

export default api;