/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AppointmentList from './AppointmentList.jsx';

// Mock the services and hooks used in the component
jest.mock('../services/api', () => ({
  appointmentAPI: {
    getMyAppointments: jest.fn(),
    deleteAppointment: jest.fn()
  }
}));

jest.mock('../services/auth', () => ({
  getCurrentUser: () => ({
    id: 1,
    name: 'John Doe'
  })
}));

jest.mock('../services/appointmentUtils', () => ({
  validateAppointmentId: jest.fn(() => true)
}));

const { appointmentAPI } = require('../services/api');
const { validateAppointmentId } = require('../services/appointmentUtils');

describe('AppointmentList', () => {
  const user = userEvent.setup();
  const mockAppointments = [
    {
      _id: '1',
      date: '2023-12-01',
      time: '09:00',
      status: 'Confirmed',
      reason: 'Regular checkup',
      doctorName: 'Dr. Smith'
    },
    {
      _id: '2',
      date: '2023-12-15',
      time: '14:30',
      status: 'Pending',
      reason: 'Follow-up visit',
      doctor: { name: 'Dr. Johnson' }
    }
  ];

  beforeEach(() => {
    appointmentAPI.getMyAppointments.mockResolvedValue({ data: mockAppointments });
    appointmentAPI.deleteAppointment.mockResolvedValue({ success: true });
    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test('renders loading state initially', async () => {
    // Delay the response to check loading state
    appointmentAPI.getMyAppointments.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ data: mockAppointments }), 100)
    ));
    
    renderWithRouter(<AppointmentList />);
    
    expect(screen.getByText('Loading appointments...')).toBeInTheDocument();
  });

  test('renders appointments list correctly', async () => {
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('My Appointments')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    expect(screen.getByText('Appointment #2')).toBeInTheDocument();
    
    // Check details of first appointment
    expect(screen.getByText('Date & Time:')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Reason:')).toBeInTheDocument();
    expect(screen.getByText('Regular checkup')).toBeInTheDocument();
    expect(screen.getByText('Doctor:')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    
    // Check details of second appointment
    expect(screen.getByText('Dr. Johnson')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  test('shows message when no appointments exist', async () => {
    appointmentAPI.getMyAppointments.mockResolvedValue({ data: [] });
    
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText("You don't have any appointments yet.")).toBeInTheDocument();
    });
    
    expect(screen.getByRole('link', { name: 'Schedule Your First Appointment' })).toBeInTheDocument();
  });

  test('handles error when fetching appointments fails', async () => {
    appointmentAPI.getMyAppointments.mockRejectedValue(new Error('Failed to fetch'));
    
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch appointments')).toBeInTheDocument();
    });
  });

  test('calls deleteAppointment when delete button is clicked', async () => {
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this appointment? This action cannot be undone.');
    expect(appointmentAPI.deleteAppointment).toHaveBeenCalledWith('1');
    expect(alert).toHaveBeenCalledWith('Appointment deleted successfully');
  });

  test('calls edit function when edit button is clicked', async () => {
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    });
    
    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);
    
    // Since we're using BrowserRouter, we can't easily check navigation
    // But we can verify that validateAppointmentId was called
    expect(validateAppointmentId).toHaveBeenCalledWith('1', 'update');
  });

  test('filters out deleted appointment from the list', async () => {
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
      expect(screen.getByText('Appointment #2')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);
    
    // Wait for state update
    await waitFor(() => {
      expect(screen.queryByText('Appointment #1')).not.toBeInTheDocument();
    });
    
    // Second appointment should still be there
    expect(screen.getByText('Appointment #2')).toBeInTheDocument();
  });

  test('does not delete appointment when user cancels confirmation', async () => {
    global.confirm = jest.fn(() => false);
    
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this appointment? This action cannot be undone.');
    expect(appointmentAPI.deleteAppointment).not.toHaveBeenCalled();
  });

  test('shows error message when delete fails', async () => {
    appointmentAPI.deleteAppointment.mockRejectedValue(new Error('Delete failed'));
    
    renderWithRouter(<AppointmentList />);
    
    await waitFor(() => {
      expect(screen.getByText('Appointment #1')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Failed to delete appointment');
    });
  });
});