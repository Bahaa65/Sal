import { Box, Flex, Avatar, Text, IconButton, HStack, Spacer } from '@chakra-ui/react';
import { UpDownIcon } from '@chakra-ui/icons';
import { FiArrowUp, FiArrowDown, FiMessageCircle } from 'react-icons/fi';

// Assuming a User type similar to what's in AuthContext
// This could be imported from a shared types file in a larger app
type User = {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  job?: string;
};

type QuestionCardProps = {
  question: {
    id: number;
    user: User;
    content: string; // Updated from 'text' to 'content' to match API
    upvotes: number;
    downvotes: number;
    answers_count: number; // Updated from 'commentsCount' to 'answers_count'
    created_at: string; // Updated from 'time' to 'created_at'
  };
};

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" p={4} mb={6}>
      <Flex align="center" mb={3}>
        <Avatar name={`${question.user.first_name} ${question.user.last_name}`} src={question.user.avatar} mr={3} />
        <Box>
          <Text fontWeight="bold" fontSize="md">{`${question.user.first_name} ${question.user.last_name}`}</Text>
          <Text fontSize="sm" color="gray.500">{question.user.job || 'No job title'}</Text>
        </Box>
        <Spacer />
        {/* Three dots icon - you might need a custom icon or a Chakra component */}
        <IconButton
          aria-label="Options"
          icon={<Box as={UpDownIcon} transform="rotate(90deg)" />} // A simple placeholder for now
          variant="ghost"
          size="sm"
        />
      </Flex>

      <Box mb={4}>
        <Text fontSize="lg" fontWeight="medium" mb={2}>{question.content}</Text>
      </Box>

      <Flex align="center" fontSize="sm" color="gray.600">
        <HStack spacing={1} mr={4}>
          <IconButton aria-label="Upvote" icon={<FiArrowUp />} variant="ghost" size="sm" />
          <Text>{question.upvotes}</Text>
        </HStack>
        <HStack spacing={1} mr={4}>
          <IconButton aria-label="Downvote" icon={<FiArrowDown />} variant="ghost" size="sm" />
          <Text>{question.downvotes}</Text>
        </HStack>
        <HStack spacing={1}>
          <IconButton aria-label="Comments" icon={<FiMessageCircle />} variant="ghost" size="sm" />
          <Text>{question.answers_count}</Text>
        </HStack>
        <Spacer />
        <Text color="gray.500">{new Date(question.created_at).toLocaleString()}</Text>
      </Flex>
    </Box>
  );
};

export default QuestionCard; 