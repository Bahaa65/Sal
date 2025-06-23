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
  images?: string[];
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

      {/* عرض الصور إذا وُجدت */}
      {answer.images && answer.images.length > 0 && (
        <Flex gap={2} mb={3} wrap="wrap">
          {answer.images.map((img, idx) => (
            <Box key={img + idx} display="inline-block">
              <img src={img} alt={`answer-img-${idx}`} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} />
            </Box>
          ))}
        </Flex>
      )}

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