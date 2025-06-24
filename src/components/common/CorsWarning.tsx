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
        <AlertTitle>Server Connection Issue</AlertTitle>
        <AlertDescription>
          There seems to be a CORS issue. You can try one of the following solutions:
        </AlertDescription>
        <VStack align="start" spacing={1} fontSize="sm">
          <Text>1. Use a CORS Proxy for development</Text>
          <Text>2. Make sure the server supports CORS</Text>
          <Text>3. Try a different browser</Text>
        </VStack>
        <Button size="sm" colorScheme="blue" onClick={onEnableProxy}>
          Enable CORS Proxy
        </Button>
      </VStack>
    </Alert>
  );
};

export default CorsWarning; 