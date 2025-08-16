import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { isAuthenticated, logout } from '../services/auth.js';
import '../styles/Header.css';
import { getCurrentUser } from '../services/auth.js';

const Header = () => {
const navigate = useNavigate();
const user = getCurrentUser()

const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Dr.Yousif Clinic</Link>
        </div>
        
        {isAuthenticated() && <Nav />}
        
        <div className="user-menu">
          {isAuthenticated() ? (
            <div className="user-info">
              <span className="user-name">Hello {user?.name}</span> 
              <div className="user-dropdown">
                <button className="dropdown-toggle">
                  Account
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <Link to="/password-update" className="dropdown-item">Update Password</Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;