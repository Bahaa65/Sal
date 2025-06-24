import React from 'react';
import { Navigate } from 'react-router-dom';

interface SimpleRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const SimpleRoute: React.FC<SimpleRouteProps> = ({ children, requireAuth = false }) => {
  // For testing only - can be removed later
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default SimpleRoute; 