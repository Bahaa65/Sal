import { Box, Flex, Avatar, VStack, Text } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

type AskQuestionBoxProps = {
  onClick: () => void;
};

const AskQuestionBox = ({ onClick }: AskQuestionBoxProps) => {
  const { user } = useAuth();

  if (!user) return null; // Don't render if no user

  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" p={4} mb={6} onClick={onClick} cursor="pointer">
      <Flex align="center">
        <Avatar name={`${user.first_name} ${user.last_name}`} src={user.avatar} mr={3} />
        <VStack align="start" spacing={0} flex="1">
          <Text fontWeight="medium" fontSize="lg" color="black">{`${user.first_name} ${user.last_name}`}</Text>
          <Text fontSize="xl" color="gray.400" mt={0.5}>What is your Question ?</Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default AskQuestionBox; 