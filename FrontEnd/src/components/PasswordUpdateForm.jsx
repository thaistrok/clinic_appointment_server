import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../services/auth.js';
import PasswordInput from './PasswordInput.jsx';
import '../styles/PasswordUpdateForm.css';

const PasswordUpdateForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Send the correct field names that match the backend
    const result = await updatePassword({
      oldPassword: currentPassword,
      newPassword
    });

    if (result.success) {
      setSuccess(true);
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Hide success message after 3 seconds and redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="password-update-container">
      <form className="password-update-form" onSubmit={handleSubmit}>
        <h2>Update Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Password updated successfully! Redirecting...</div>}
        
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <PasswordInput
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter your current password"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter your new password"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your new password"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdateForm;