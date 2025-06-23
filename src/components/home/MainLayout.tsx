import React from 'react';
import HomeHeader from './HomeHeader';
import { Box } from '@chakra-ui/react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH="100vh" bg="gray.100">
      <HomeHeader />
      {children}
    </Box>
  );
};

export default MainLayout; 