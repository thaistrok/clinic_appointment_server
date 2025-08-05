import React, { useState } from 'react';
import '../styles/PasswordInput.css';

const PasswordInput = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        {...props}
      />
      <button
        type="button"
        className="toggle-password"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordInput;