import React from 'react';
import { Box, Container, Heading, VStack, Text } from '@chakra-ui/react';
import ConnectionTest from '../../components/common/ConnectionTest';
import CorsWarning from '../../components/common/CorsWarning';

const TestConnection: React.FC = () => {
  const handleEnableProxy = () => {
    // You can add logic to enable the proxy
    console.log('Enable CORS Proxy');
  };

  return (
    <Box bg="gray.100" minH="100vh" py={8}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="blue.600">
            Server Connection Test
          </Heading>
          
          <CorsWarning onEnableProxy={handleEnableProxy} />
          
          <ConnectionTest />
          
          <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>CORS Issue Solutions</Heading>
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">1. Use CORS Proxy:</Text>
              <Text fontSize="sm" color="gray.600">
                - api.allorigins.win
                - cors-anywhere.herokuapp.com
                - thingproxy.freeboard.io
              </Text>
              
              <Text fontWeight="bold" mt={4}>2. Server Settings:</Text>
              <Text fontSize="sm" color="gray.600">
                - Make sure the server supports CORS
                - Add appropriate headers
                - Allow OPTIONS requests
              </Text>
              
              <Text fontWeight="bold" mt={4}>3. Alternative Solutions:</Text>
              <Text fontSize="sm" color="gray.600">
                - Use a different browser
                - Disable CORS in the browser (for development only)
                - Use Chrome with --disable-web-security
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TestConnection; 