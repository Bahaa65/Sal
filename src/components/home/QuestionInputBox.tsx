import { Box, Input } from '@chakra-ui/react';

const QuestionInputBox = () => {
  return (
    <Box mt="24px" p="16px" bg="white" borderRadius="lg" boxShadow="md">
      <Input
        placeholder="What is your Question ?"
        bg="white"
        borderRadius="full"
        h="40px"
        pl={4}
        border="1px solid"
        borderColor="gray.200"
        textAlign="left"
      />
    </Box>
  );
};

export default QuestionInputBox; 