import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../services/auth.js';
import '../styles/Nav.css';

const Nav = () => {
  const location = useLocation();
  const user = isAuthenticated() ? getCurrentUser() : null;

  // Show different navigation based on user role
  const renderNavItems = () => {
    if (!user) {
      return (
        <>
          <li className="nav-item">
            <Link 
              to="/login" 
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/register" 
              className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
            >
              Register
            </Link>
          </li>
        </>
      );
    }

    if (user.role === 'doctor') {
      return (
        <>
          <li className="nav-item">
            <Link 
              to="/doctor-dashboard" 
              className={`nav-link ${location.pathname === '/doctor-dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/appointments" 
              className={`nav-link ${location.pathname.startsWith('/appointments') ? 'active' : ''}`}
            >
              Appointments
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/prescriptions" 
              className={`nav-link ${location.pathname === '/prescriptions' ? 'active' : ''}`}
            >
              Prescriptions
            </Link>
          </li>
        </>
      );
    }

    // Default to patient navigation
    return (
      <>
        <li className="nav-item">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/appointments" 
            className={`nav-link ${location.pathname.startsWith('/appointments') ? 'active' : ''}`}
          >
            Appointments
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/prescriptions" 
            className={`nav-link ${location.pathname === '/prescriptions' ? 'active' : ''}`}
          >
            Prescriptions
          </Link>
        </li>
      </>
    );
  };

  return (
    <nav className="nav">
      <ul className="nav-list">
        {renderNavItems()}
      </ul>
    </nav>
  );
};

export default Nav;