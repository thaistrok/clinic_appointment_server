import { authAPI } from './api';

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'No token received' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registration failed' 
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  authAPI.logout();
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await authAPI.updatePassword(passwordData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Password update failed' 
    };
  }
};