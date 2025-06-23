import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // عرض spinner أثناء التحقق من المصادقة
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول، توجيه إلى صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // إذا كان مسجل الدخول، عرض المحتوى المطلوب
  return <>{children}</>;
};

export default PrivateRoute; 