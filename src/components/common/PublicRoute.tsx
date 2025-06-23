import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
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

  // إذا كان المستخدم مسجل الدخول، توجيه إلى الصفحة الرئيسية
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }

  // إذا لم يكن مسجل الدخول، عرض المحتوى المطلوب
  return <>{children}</>;
};

export default PublicRoute; 