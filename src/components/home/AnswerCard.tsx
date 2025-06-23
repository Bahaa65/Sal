import { Box, Flex, Avatar, Text, IconButton, HStack, Spacer } from '@chakra-ui/react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// This should ideally come from a shared types file
type User = {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  job?: string;
};

// This should ideally come from a shared types file
type Answer = {
  id: number;
  user: User;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
};

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = ({ answer }: AnswerCardProps) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mt={4} bg="gray.50">
      <Flex align="center" mb={3}>
        <Avatar name={`${answer.user.first_name} ${answer.user.last_name}`} src={answer.user.avatar} mr={3} size="sm" />
        <Box>
          <Text fontWeight="bold" fontSize="sm">{`${answer.user.first_name} ${answer.user.last_name}`}</Text>
          <Text fontSize="xs" color="gray.500">{answer.user.job || 'No job title'}</Text>
        </Box>
      </Flex>

      <Text mb={3}>{answer.content}</Text>

      <Flex align="center" fontSize="sm" color="gray.600">
        <HStack spacing={1} mr={4}>
          <IconButton aria-label="Upvote" icon={<FiArrowUp />} variant="ghost" size="sm" />
          <Text>{answer.upvotes}</Text>
        </HStack>
        <HStack spacing={1} mr={4}>
          <IconButton aria-label="Downvote" icon={<FiArrowDown />} variant="ghost" size="sm" />
          <Text>{answer.downvotes}</Text>
        </HStack>
        <Spacer />
        <Text fontSize="xs" color="gray.500">{new Date(answer.created_at).toLocaleString()}</Text>
      </Flex>
    </Box>
  );
};

export default AnswerCard; 