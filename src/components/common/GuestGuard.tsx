import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // While checking auth, it's better to show nothing or a loader.
    // Returning null is fine for a brief moment.
    return null;
  }

  if (isAuthenticated) {
    // If user is authenticated, redirect them away from guest pages (like login)
    // to the main dashboard or home page.
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, render the guest page (Login, Register)
  return <>{children}</>;
};

export default GuestGuard; 