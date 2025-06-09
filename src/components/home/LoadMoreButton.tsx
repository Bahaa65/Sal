import { Button } from '@chakra-ui/react';

const LoadMoreButton = () => {
  return (
    <Button
      bg="#0078D4"
      color="white"
      _hover={{ bg: '#006CBE' }}
      borderRadius="full"
      h="45px"
      px="24px"
      minW="120px"
    >
      Load More
    </Button>
  );
};

export default LoadMoreButton; 