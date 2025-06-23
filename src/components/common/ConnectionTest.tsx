import React, { useState } from 'react';
import { Box, Button, Text, VStack, HStack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { apiService } from '../../services/api.service';

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
      // اختبار الاتصال بالخادم
      const response = await fetch('https://hossamoka4a.pythonanywhere.com/api/questions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'الاتصال بالخادم يعمل بشكل صحيح',
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      } else {
        setTestResult({
          success: false,
          message: `خطأ في الخادم: ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `خطأ في الاتصال: ${error.message}`,
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
      // اختبار الاتصال باستخدام proxy
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
          message: 'الاتصال باستخدام Proxy يعمل بشكل صحيح',
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      } else {
        setTestResult({
          success: false,
          message: `خطأ في Proxy: ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
          }
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `خطأ في الاتصال بالـ Proxy: ${error.message}`,
        details: error
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">اختبار الاتصال بالخادم</Text>
        
        <HStack spacing={4}>
          <Button 
            colorScheme="blue" 
            onClick={testConnection}
            isLoading={isTesting}
            loadingText="جاري الاختبار..."
          >
            اختبار الاتصال المباشر
          </Button>
          
          <Button 
            colorScheme="green" 
            onClick={testWithProxy}
            isLoading={isTesting}
            loadingText="جاري الاختبار..."
          >
            اختبار الاتصال بالـ Proxy
          </Button>
        </HStack>

        {testResult && (
          <Alert status={testResult.success ? 'success' : 'error'}>
            <AlertIcon />
            <Box>
              <AlertTitle>
                {testResult.success ? 'نجح الاختبار' : 'فشل الاختبار'}
              </AlertTitle>
              <AlertDescription>
                {testResult.message}
                {testResult.details && (
                  <Text fontSize="sm" mt={2}>
                    التفاصيل: {JSON.stringify(testResult.details, null, 2)}
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