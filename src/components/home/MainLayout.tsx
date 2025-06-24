import React from 'react';
import HomeHeader from './HomeHeader';
import { Box } from '@chakra-ui/react';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearchChange?: (searchTerm: string) => void;
  showSearch?: boolean;
}

const MainLayout = ({ children, onSearchChange, showSearch = false }: MainLayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.100">
      <HomeHeader onSearchChange={onSearchChange} showSearch={showSearch} />
      {children}
    </Box>
  );
};

export default MainLayout; 