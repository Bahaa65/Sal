import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner, Flex } from '@chakra-ui/react';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    // a 'from' state is passed to redirect back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the requested page
  return <>{children}</>;
};

export default AuthGuard; 