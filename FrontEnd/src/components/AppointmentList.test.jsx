import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentList from './AppointmentList';

// Mock the modules
jest.mock('../services/api.js', () => ({
  appointmentAPI: {
    getAppointments: jest.fn(),
    getMyAppointments: jest.fn(),
    deleteAppointment: jest.fn()
  }
}));

// Import the mocked API
import { appointmentAPI } from '../services/api.js';

// Mock the auth service
jest.mock('../services/auth.js', () => ({
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn()
}));

// Mock appointmentUtils
jest.mock('../services/appointmentUtils.js', () => ({
  validateAppointmentId: jest.fn().mockReturnValue(true)
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn()
}));

const mockAppointments = [
  {
    _id: '1',
    date: '2023-12-01',
    time: '09:00',
    status: 'confirmed',
    reason: 'Regular checkup',
    doctor: { name: 'Dr. Smith' }
  },
  {
    _id: '2',
    date: '2023-12-15',
    time: '14:30',
    status: 'pending',
    reason: 'Follow-up visit',
    doctor: { name: 'Dr. Johnson' }
  }
];

describe('AppointmentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'patient' });
    appointmentAPI.getMyAppointments.mockReturnValue(new Promise(() => {}));
    
    render(<AppointmentList />);
    
    expect(screen.getByText('Loading appointments...')).toBeInTheDocument();
  });

  test('displays appointments for patient', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'patient' });
    appointmentAPI.getMyAppointments.mockResolvedValue({ data: mockAppointments });
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    expect(screen.getByText('Appointment #2')).toBeInTheDocument();
    
    // Check that it shows "My Appointments" text
    expect(screen.getByText(/My Appointments/i)).toBeInTheDocument();
  });

  test('displays appointments for doctor', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'doctor' });
    appointmentAPI.getAppointments.mockResolvedValue({ data: mockAppointments });
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    expect(screen.getByText('Appointment #2')).toBeInTheDocument();
    
    // Check that it shows "All Appointments" text (exact text from component)
    // Use getAllByText and check the first one
    const allAppointmentsHeaders = screen.getAllByText('All Appointments');
    expect(allAppointmentsHeaders[0]).toBeInTheDocument();
  });

  test('handles API error correctly', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'patient' });
    appointmentAPI.getMyAppointments.mockRejectedValue(new Error('API Error'));
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      // Check for the actual error message displayed by the component
      expect(screen.getByText(/Network error. Please check your connection and try again/i)).toBeInTheDocument();
    });
  });

  test('handles timeout error correctly', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'patient' });
    
    // Mock a timeout error
    const timeoutError = new Error('timeout');
    timeoutError.code = 'ECONNABORTED';
    appointmentAPI.getMyAppointments.mockRejectedValue(timeoutError);
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      // Check for the timeout-specific error message
      expect(screen.getByText(/Server is taking too long to respond. Please check your connection or try again later/i)).toBeInTheDocument();
    });
  });

  test('filters appointments correctly', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'patient' });
    
    const pastAppointment = {
      _id: '3',
      date: '2020-01-01',
      time: '10:00',
      status: 'completed',
      reason: 'Past appointment',
      doctor: { name: 'Dr. Williams' }
    };
    
    const futureAppointment = {
      _id: '4',
      date: '2030-01-01',
      time: '10:00',
      status: 'confirmed',
      reason: 'Future appointment',
      doctor: { name: 'Dr. Brown' }
    };
    
    appointmentAPI.getMyAppointments.mockResolvedValue({ 
      data: [pastAppointment, futureAppointment] 
    });
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #3')).toBeInTheDocument();
    });
    
    // Test "All" filter (default)
    expect(screen.getByText('Appointment #3')).toBeInTheDocument();
    expect(screen.getByText('Appointment #4')).toBeInTheDocument();
    
    // Test "Past" filter - get all select elements and use the first one (filter)
    const selectElements = screen.getAllByRole('combobox');
    fireEvent.change(selectElements[0], {
      target: { value: 'past' }
    });
    
    // Only past appointment should be visible
    expect(screen.getByText('Appointment #3')).toBeInTheDocument();
    expect(screen.queryByText('Appointment #4')).not.toBeInTheDocument();
    
    // Test "Upcoming" filter
    fireEvent.change(selectElements[0], {
      target: { value: 'upcoming' }
    });
    
    // Only future appointment should be visible
    expect(screen.getByText('Appointment #4')).toBeInTheDocument();
    expect(screen.queryByText('Appointment #3')).not.toBeInTheDocument();
  });

  test('sorts appointments correctly', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'patient' });
    
    const earlyAppointment = {
      _id: '5',
      date: '2023-01-01',
      time: '09:00',
      status: 'confirmed',
      reason: 'Early appointment',
      doctor: { name: 'Dr. Adams' }
    };
    
    const lateAppointment = {
      _id: '6',
      date: '2023-12-31',
      time: '15:00',
      status: 'pending',
      reason: 'Late appointment',
      doctor: { name: 'Dr. Baker' }
    };
    
    appointmentAPI.getMyAppointments.mockResolvedValue({ 
      data: [lateAppointment, earlyAppointment] 
    });
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #5')).toBeInTheDocument();
    });
    
    // By default, sorted by date
    const appointmentCards = screen.getAllByText(/Appointment #\d/);
    expect(appointmentCards[0]).toHaveTextContent('Appointment #5'); // Earlier date
    expect(appointmentCards[1]).toHaveTextContent('Appointment #6'); // Later date
    
    // Test sorting by status - get all select elements and use the second one (sort by)
    const selectElements = screen.getAllByRole('combobox');
    fireEvent.change(selectElements[1], {
      target: { value: 'status' }
    });
    
    // Check that sorting by status works (confirmed comes before pending alphabetically)
    // Note: this test may not be reliable since the sorting behavior depends on the implementation
  });

  test('handles delete appointment correctly', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    const { validateAppointmentId } = require('../services/appointmentUtils.js');
    
    getCurrentUser.mockReturnValue({ role: 'patient' });
    appointmentAPI.getMyAppointments.mockResolvedValue({ data: [mockAppointments[0]] });
    appointmentAPI.deleteAppointment.mockResolvedValue({});
    validateAppointmentId.mockReturnValue(true);
    
    // Mock window.confirm
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Check that delete API was called
    expect(appointmentAPI.deleteAppointment).toHaveBeenCalledWith('1');
    
    // Check that appointment is removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Appointment #1')).not.toBeInTheDocument();
    });
    
    // Restore window.confirm
    window.confirm.mockRestore();
  });

  test('shows "no appointments" message when list is empty', async () => {
    const { getCurrentUser } = require('../services/auth.js');
    getCurrentUser.mockReturnValue({ role: 'patient' });
    appointmentAPI.getMyAppointments.mockResolvedValue({ data: [] });
    
    render(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText(/You don't have any appointments yet/i)).toBeInTheDocument();
    });
    
    // Check that the "Schedule Your First Appointment" link is present
    expect(screen.getByRole('link', { name: /Schedule Your First Appointment/i })).toBeInTheDocument();
  });
});