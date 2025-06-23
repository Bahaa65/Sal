import React, { useState } from 'react';
import { Box, Container, Heading, VStack, Button, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const SimpleTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testDirectConnection = async () => {
    try {
      setTestResult('جاري اختبار الاتصال المباشر...');
      
      const response = await fetch('https://hossamoka4a.pythonanywhere.com/api/questions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`نجح الاتصال المباشر! البيانات: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult(`فشل الاتصال المباشر: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setTestResult(`خطأ في الاتصال المباشر: ${error.message}`);
    }
  };

  const testProxyConnection = async () => {
    try {
      setTestResult('جاري اختبار الاتصال بالـ Proxy...');
      
      const response = await fetch('/api/questions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`نجح الاتصال بالـ Proxy! البيانات: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult(`فشل الاتصال بالـ Proxy: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      setTestResult(`خطأ في الاتصال بالـ Proxy: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setTestResult('جاري اختبار تسجيل الدخول...');
      
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
      setTestResult(`نتيجة تسجيل الدخول: ${response.status} ${response.statusText}\nالبيانات: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setTestResult(`خطأ في تسجيل الدخول: ${error.message}`);
    }
  };

  return (
    <Box bg="gray.100" minH="100vh" py={8}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="blue.600">
            اختبار الاتصال البسيط
          </Heading>
          
          <VStack spacing={4}>
            <Button colorScheme="blue" onClick={testDirectConnection} width="full">
              اختبار الاتصال المباشر
            </Button>
            
            <Button colorScheme="green" onClick={testProxyConnection} width="full">
              اختبار الاتصال بالـ Proxy
            </Button>
            
            <Button colorScheme="purple" onClick={testLogin} width="full">
              اختبار تسجيل الدخول
            </Button>
          </VStack>

          {testResult && (
            <Alert status={testResult.includes('نجح') ? 'success' : 'error'}>
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {testResult.includes('نجح') ? 'نجح الاختبار' : 'فشل الاختبار'}
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