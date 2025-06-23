import React, { useState } from 'react';
import { Box, Button, Text, VStack, HStack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const ConnectionTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test server connection
      const response = await fetch('https://hossamoka4a.pythonanywhere.com/api/questions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Server connection is working correctly',
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      } else {
        setTestResult({
          success: false,
          message: `Server error: ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Connection error: ${error.message}`,
        details: error
      });
    } finally {
      setIsTesting(false);
    }
  };

  const testWithProxy = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test connection using proxy
      const proxyUrl = 'https://api.allorigins.win/raw?url=https://hossamoka4a.pythonanywhere.com/api/questions/';
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Proxy connection is working correctly',
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      } else {
        setTestResult({
          success: false,
          message: `Proxy error: ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Proxy connection error: ${error.message}`,
        details: error
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Test server connection</Text>
        
        <HStack spacing={4}>
          <Button 
            colorScheme="blue" 
            onClick={testConnection}
            isLoading={isTesting}
            loadingText="جاري الاختبار..."
          >
            Test direct connection
          </Button>
          
          <Button 
            colorScheme="green" 
            onClick={testWithProxy}
            isLoading={isTesting}
            loadingText="جاري الاختبار..."
          >
            Test Proxy connection
          </Button>
        </HStack>

        {testResult && (
          <Alert status={testResult.success ? 'success' : 'error'}>
            <AlertIcon />
            <Box>
              <AlertTitle>
                {testResult.success ? 'Test passed' : 'Test failed'}
              </AlertTitle>
              <AlertDescription>
                {testResult.message}
                {testResult.details && (
                  <Text fontSize="sm" mt={2}>
                    Details: {JSON.stringify(testResult.details, null, 2)}
                  </Text>
                )}
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default ConnectionTest; 