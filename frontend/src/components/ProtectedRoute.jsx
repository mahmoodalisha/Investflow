import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user has a token in their browser
  const token = localStorage.getItem('token');

  // If no token exists, kick them back to the login page immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they have a token, render the page they were trying to access!
  return children;
};

export default ProtectedRoute;