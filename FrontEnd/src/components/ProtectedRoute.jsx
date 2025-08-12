import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/auth.js';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check role if requiredRole is specified
  if (requiredRole) {
    const user = getCurrentUser();
    if (user?.role !== requiredRole) {
      // Redirect to dashboard if user doesn't have the required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;