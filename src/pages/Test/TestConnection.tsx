import React from 'react';
import { Box, Container, Heading, VStack, Text } from '@chakra-ui/react';
import ConnectionTest from '../../components/common/ConnectionTest';
import CorsWarning from '../../components/common/CorsWarning';

const TestConnection: React.FC = () => {
  const handleEnableProxy = () => {
    // يمكن إضافة منطق لتفعيل الـ proxy
    console.log('تفعيل CORS Proxy');
  };

  return (
    <Box bg="gray.100" minH="100vh" py={8}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="blue.600">
            اختبار الاتصال بالخادم
          </Heading>
          
          <CorsWarning onEnableProxy={handleEnableProxy} />
          
          <ConnectionTest />
          
          <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>حلول مشكلة CORS</Heading>
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">1. استخدام CORS Proxy:</Text>
              <Text fontSize="sm" color="gray.600">
                - api.allorigins.win
                - cors-anywhere.herokuapp.com
                - thingproxy.freeboard.io
              </Text>
              
              <Text fontWeight="bold" mt={4}>2. إعدادات الخادم:</Text>
              <Text fontSize="sm" color="gray.600">
                - التأكد من أن الخادم يدعم CORS
                - إضافة headers مناسبة
                - السماح بـ OPTIONS requests
              </Text>
              
              <Text fontWeight="bold" mt={4}>3. حلول بديلة:</Text>
              <Text fontSize="sm" color="gray.600">
                - استخدام متصفح مختلف
                - تعطيل CORS في المتصفح (للتطوير فقط)
                - استخدام Chrome مع --disable-web-security
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TestConnection; 