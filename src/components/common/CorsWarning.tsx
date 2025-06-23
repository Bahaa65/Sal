import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Button, VStack, Text } from '@chakra-ui/react';

interface CorsWarningProps {
  onEnableProxy: () => void;
}

const CorsWarning: React.FC<CorsWarningProps> = ({ onEnableProxy }) => {
  return (
    <Alert status="warning" borderRadius="md" mb={4}>
      <AlertIcon />
      <VStack align="start" spacing={2} flex={1}>
        <AlertTitle>مشكلة في الاتصال بالخادم</AlertTitle>
        <AlertDescription>
          يبدو أن هناك مشكلة في CORS. يمكنك تجربة أحد الحلول التالية:
        </AlertDescription>
        <VStack align="start" spacing={1} fontSize="sm">
          <Text>1. استخدام CORS Proxy للتطوير</Text>
          <Text>2. التأكد من أن الخادم يدعم CORS</Text>
          <Text>3. استخدام متصفح مختلف</Text>
        </VStack>
        <Button size="sm" colorScheme="blue" onClick={onEnableProxy}>
          تفعيل CORS Proxy
        </Button>
      </VStack>
    </Alert>
  );
};

export default CorsWarning; 