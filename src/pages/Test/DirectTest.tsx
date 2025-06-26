import React, { useState } from 'react';
import { Box, Container, Heading, VStack, Button, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Code, HStack } from '@chakra-ui/react';

const DirectTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    success: boolean;
    message: string;
    details?: any;
  }>>([]);

  const addTestResult = (name: string, success: boolean, message: string, details?: any) => {
    setTestResults(prev => [...prev, { name, success, message, details }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testDirectQuestions = async () => {
    try {
      addTestResult('Direct Questions', false, 'جاري الاختبار...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        addTestResult('Direct Questions', true, `نجح! Status: ${response.status}`, data);
      } else {
        addTestResult('Direct Questions', false, `فشل! Status: ${response.status} ${response.statusText}`, data);
      }
    } catch (error: any) {
      addTestResult('Direct Questions', false, `خطأ: ${error.message}`, error);
    }
  };

  const testDirectLogin = async () => {
    try {
      addTestResult('Direct Login', false, 'جاري الاختبار...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/`, {
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
      addTestResult('Direct Login', response.ok, `Status: ${response.status} ${response.statusText}`, data);
    } catch (error: any) {
      addTestResult('Direct Login', false, `خطأ: ${error.message}`, error);
    }
  };

  const testWithCredentials = async () => {
    try {
      addTestResult('Login with Credentials', false, 'جاري الاختبار...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'medhat@example.com',
          password: 'password123'
        }),
      });

      const data = await response.json();
      addTestResult('Login with Credentials', response.ok, `Status: ${response.status} ${response.statusText}`, data);
    } catch (error: any) {
      addTestResult('Login with Credentials', false, `خطأ: ${error.message}`, error);
    }
  };

  const runAllTests = async () => {
    clearResults();
    await testDirectQuestions();
    await testDirectLogin();
    await testWithCredentials();
  };

  return (
    <Box bg="gray.100" minH="100vh" py={8}>
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="blue.600">
            Direct Connection Test
          </Heading>
          
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                This test bypasses CORS and tries to connect directly to the server.
                It may not work in a regular browser due to CORS policies.
              </AlertDescription>
            </Box>
          </Alert>
          
          <VStack spacing={4}>
            <Button colorScheme="blue" onClick={runAllTests} width="full" size="lg">
              Run All Tests
            </Button>
            
            <Button colorScheme="green" onClick={clearResults} width="full">
              Clear Results
            </Button>
          </VStack>

          <HStack spacing={4}>
            <Button colorScheme="teal" onClick={testDirectQuestions} flex={1}>
              Questions Test
            </Button>
            
            <Button colorScheme="purple" onClick={testDirectLogin} flex={1}>
              Login Test
            </Button>
            
            <Button colorScheme="orange" onClick={testWithCredentials} flex={1}>
              Valid Credentials Test
            </Button>
          </HStack>

          {testResults.map((result, index) => (
            <Alert key={index} status={result.success ? 'success' : 'error'} borderRadius="md">
              <AlertIcon />
              <Box flex={1}>
                <AlertTitle>{result.name}</AlertTitle>
                <AlertDescription>
                  <Text mb={2}>{result.message}</Text>
                  {result.details && (
                    <Code p={2} borderRadius="md" fontSize="xs" display="block" whiteSpace="pre-wrap">
                      {JSON.stringify(result.details, null, 2)}
                    </Code>
                  )}
                </AlertDescription>
              </Box>
            </Alert>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default DirectTest; 