import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <Flex
      minH="100vh"
      direction="column"
      bg="white"
    >
      {children}
    </Flex>
  );
};

export default HomeLayout; 