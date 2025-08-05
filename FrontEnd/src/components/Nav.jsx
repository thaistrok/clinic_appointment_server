import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Nav.css';

const Nav = () => {
  const location = useLocation();

  return (
    <nav className="nav">
      <ul className="nav-list">
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
      </ul>
    </nav>
  );
};

export default Nav;