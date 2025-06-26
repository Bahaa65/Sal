import React, { useState } from 'react';
import { Box, Container, Heading, VStack, Button, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const SimpleTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testDirectConnection = async () => {
    try {
      setTestResult('Testing direct connection...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`Direct connection succeeded! Data: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult(`Direct connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setTestResult(`Direct connection error: ${error.message}`);
    }
  };

  const testProxyConnection = async () => {
    try {
      setTestResult('Testing Proxy connection...');
      
      const response = await fetch('/api/questions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`Proxy connection succeeded! Data: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult(`Proxy connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setTestResult(`Proxy connection error: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        }),
      });

      const data = await response.json();
      setTestResult(`Login result: ${response.status} ${response.statusText}\nData: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setTestResult(`Login error: ${error.message}`);
    }
  };

  return (
    <Box bg="gray.100" minH="100vh" py={8}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="blue.600">
            Simple Connection Test
          </Heading>
          
          <VStack spacing={4}>
            <Button colorScheme="blue" onClick={testDirectConnection} width="full">
              Direct Connection Test
            </Button>
            
            <Button colorScheme="green" onClick={testProxyConnection} width="full">
              Proxy Connection Test
            </Button>
            
            <Button colorScheme="purple" onClick={testLogin} width="full">
              Login Test
            </Button>
          </VStack>

          {testResult && (
            <Alert status={testResult.includes('succeeded') ? 'success' : 'error'}>
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {testResult.includes('succeeded') ? 'Test succeeded' : 'Test failed'}
                </AlertTitle>
                <AlertDescription>
                  <Text whiteSpace="pre-wrap" fontSize="sm">
                    {testResult}
                  </Text>
                </AlertDescription>
              </Box>
            </Alert>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default SimpleTest; 