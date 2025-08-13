import React, { useState } from 'react';
import '../styles/PasswordInput.css';

const PasswordInput = ({ id, value, onChange, required, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-container">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="password-input"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="toggle-password"
        disabled={disabled}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordInput;