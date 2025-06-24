import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  Button, 
  Text, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription, 
  Code, 
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge
} from '@chakra-ui/react';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: any;
  timestamp: Date;
}

const ComprehensiveTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (name: string, success: boolean, message: string, details?: any) => {
    const result: TestResult = {
      name,
      success,
      message,
      details,
      timestamp: new Date()
    };
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Direct connection test
  const testDirectConnection = async () => {
    try {
      addTestResult('Direct Connection', false, 'Testing...');
      
      const response = await fetch('https://hossamoka4a.pythonanywhere.com/api/questions/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      
      if (response.ok) {
        addTestResult('Direct Connection', true, `Success! Status: ${response.status}`, data);
      } else {
        addTestResult('Direct Connection', false, `Failed! Status: ${response.status}`, data);
      }
    } catch (error: any) {
      addTestResult('Direct Connection', false, `Error: ${error.message}`, error);
    }
  };

  // Vite Proxy test
  const testViteProxy = async () => {
    try {
      addTestResult('Vite Proxy', false, 'Testing...');
      
      const response = await fetch('/api/questions/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      
      if (response.ok) {
        addTestResult('Vite Proxy', true, `Success! Status: ${response.status}`, data);
      } else {
        addTestResult('Vite Proxy', false, `Failed! Status: ${response.status}`, data);
      }
    } catch (error: any) {
      addTestResult('Vite Proxy', false, `Error: ${error.message}`, error);
    }
  };

  // Login test
  const testLogin = async () => {
    try {
      addTestResult('Login Test', false, 'Testing...');
      
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        }),
      });

      const data = await response.json();
      addTestResult('Login Test', response.ok, `Status: ${response.status}`, data);
    } catch (error: any) {
      addTestResult('Login Test', false, `Error: ${error.message}`, error);
    }
  };

  // Create question test
  const testCreateQuestion = async () => {
    try {
      addTestResult('Create Question', false, 'Testing...');
      
      const response = await fetch('/api/questions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Question',
          content: 'This is a test question'
        }),
      });

      const data = await response.json();
      addTestResult('Create Question', response.ok, `Status: ${response.status}`, data);
    } catch (error: any) {
      addTestResult('Create Question', false, `Error: ${error.message}`, error);
    }
  };

  // تشغيل جميع الاختبارات
  const runAllTests = async () => {
    setIsLoading(true);
    clearResults();
    
    await testDirectConnection();
    await testViteProxy();
    await testLogin();
    await testCreateQuestion();
    
    setIsLoading(false);
  };

  const getStatusColor = (success: boolean) => success ? 'green' : 'red';
  const getStatusIcon = (success: boolean) => success ? '✅' : '❌';

  return (
    <Box bg="gray.100" minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="blue.600">
            Comprehensive Connection Test
          </Heading>
          
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Test Information</AlertTitle>
              <AlertDescription>
                This test checks all available connection methods: direct connection, Vite Proxy, login, and question creation.
              </AlertDescription>
            </Box>
          </Alert>

          <Tabs variant="enclosed">
            <TabList>
              <Tab>Tests</Tab>
              <Tab>Results</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4}>
                  <Button 
                    colorScheme="blue" 
                    onClick={runAllTests} 
                    width="full" 
                    size="lg"
                    isLoading={isLoading}
                    loadingText="جاري تشغيل الاختبارات..."
                  >
                    Run All Tests
                  </Button>
                  
                  <Button colorScheme="green" onClick={clearResults} width="full">
                    Clear Results
                  </Button>

                  <HStack spacing={4} width="full">
                    <Button colorScheme="teal" onClick={testDirectConnection} flex={1}>
                      Direct Connection Test
                    </Button>
                    <Button colorScheme="purple" onClick={testViteProxy} flex={1}>
                      Vite Proxy Test
                    </Button>
                  </HStack>

                  <HStack spacing={4} width="full">
                    <Button colorScheme="orange" onClick={testLogin} flex={1}>
                      Login Test
                    </Button>
                    <Button colorScheme="pink" onClick={testCreateQuestion} flex={1}>
                      Create Question Test
                    </Button>
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {testResults.length === 0 ? (
                    <Alert status="warning">
                      <AlertIcon />
                      No test results. Please run the tests first.
                    </Alert>
                  ) : (
                    testResults.map((result, index) => (
                      <Alert key={index} status={result.success ? 'success' : 'error'} borderRadius="md">
                        <AlertIcon />
                        <Box flex={1}>
                          <HStack justify="space-between" mb={2}>
                            <AlertTitle>{result.name}</AlertTitle>
                            <HStack spacing={2}>
                              <Badge colorScheme={getStatusColor(result.success)}>
                                {getStatusIcon(result.success)} {result.success ? 'Success' : 'Failed'}
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                {result.timestamp.toLocaleTimeString()}
                              </Text>
                            </HStack>
                          </HStack>
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
                    ))
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default ComprehensiveTest; 