import React, { useState } from 'react';
import { Box, Container, Heading, VStack, Button, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Code } from '@chakra-ui/react';

const ProxyTest: React.FC = () => {
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

  const testProxyQuestions = async () => {
    try {
      addTestResult('Proxy Questions', false, 'جاري الاختبار...');
      
      const response = await fetch('/api/questions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        addTestResult('Proxy Questions', true, `نجح! Status: ${response.status}`, data);
      } else {
        addTestResult('Proxy Questions', false, `فشل! Status: ${response.status} ${response.statusText}`, data);
      }
    } catch (error: any) {
      addTestResult('Proxy Questions', false, `خطأ: ${error.message}`, error);
    }
  };

  const testDirectQuestions = async () => {
    try {
      addTestResult('Direct Questions', false, 'جاري الاختبار...');
      
      const response = await fetch('https://hossamoka4a.pythonanywhere.com/api/questions/', {
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

  const testProxyLogin = async () => {
    try {
      addTestResult('Proxy Login', false, 'جاري الاختبار...');
      
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
      addTestResult('Proxy Login', response.ok, `Status: ${response.status} ${response.statusText}`, data);
    } catch (error: any) {
      addTestResult('Proxy Login', false, `خطأ: ${error.message}`, error);
    }
  };

  const testDirectLogin = async () => {
    try {
      addTestResult('Direct Login', false, 'جاري الاختبار...');
      
      const response = await fetch('https://hossamoka4a.pythonanywhere.com/api/auth/login/', {
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

  const runAllTests = async () => {
    clearResults();
    await testDirectQuestions();
    await testProxyQuestions();
    await testDirectLogin();
    await testProxyLogin();
  };

  return (
    <Box bg="gray.100" minH="100vh" py={8}>
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="blue.600">
            اختبار الـ Proxy
          </Heading>
          
          <VStack spacing={4}>
            <Button colorScheme="blue" onClick={runAllTests} width="full" size="lg">
              تشغيل جميع الاختبارات
            </Button>
            
            <Button colorScheme="green" onClick={clearResults} width="full">
              مسح النتائج
            </Button>
          </VStack>

          <VStack spacing={4}>
            <Button colorScheme="teal" onClick={testDirectQuestions} width="full">
              اختبار الاتصال المباشر للأسئلة
            </Button>
            
            <Button colorScheme="purple" onClick={testProxyQuestions} width="full">
              اختبار الاتصال بالـ Proxy للأسئلة
            </Button>
            
            <Button colorScheme="orange" onClick={testDirectLogin} width="full">
              اختبار تسجيل الدخول المباشر
            </Button>
            
            <Button colorScheme="pink" onClick={testProxyLogin} width="full">
              اختبار تسجيل الدخول بالـ Proxy
            </Button>
          </VStack>

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

export default ProxyTest; 