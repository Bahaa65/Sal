import { Box, Flex, Avatar, Text, IconButton, HStack, Spacer, Menu, MenuButton, MenuList, MenuItem, Icon } from '@chakra-ui/react';
import { FiArrowUp, FiArrowDown, FiMoreVertical, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { voteAnswer } from '../../services/apiClient';

// This should ideally come from a shared types file
type User = {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  job?: string;
  username?: string;
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
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();
  const [votes, setVotes] = useState({ upvotes: answer.upvotes, downvotes: answer.downvotes });

  const handleHide = () => {
    setHidden(true);
  };
  const handleViewProfile = () => {
    navigate(`/users/${answer.user.username || answer.user.id}`);
  };

  const handleVote = async (vote: 1 | 2) => {
    try {
      await voteAnswer(answer.id, vote);
      setVotes((prev) =>
        vote === 1
          ? { ...prev, upvotes: prev.upvotes + 1 }
          : { ...prev, downvotes: prev.downvotes + 1 }
      );
    } catch (e) {
    }
  };

  if (hidden) return null;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mt={4} bg="gray.50">
      <Flex align="center" mb={3}>
        <Avatar name={`${answer.user.first_name} ${answer.user.last_name}`} src={answer.user.avatar} mr={3} size="sm" />
        <Box>
          <Text fontWeight="bold" fontSize="sm">{`${answer.user.first_name} ${answer.user.last_name}`}</Text>
          <Text fontSize="xs" color="gray.500">{answer.user.job || 'No job title'}</Text>
        </Box>
        <Spacer />
        <Menu>
          <MenuButton as={IconButton} icon={<Icon as={FiMoreVertical} />} variant="ghost" size="sm" />
          <MenuList>
            <MenuItem icon={<Icon as={FiX} />} onClick={handleHide}>
              Hide Comment
            </MenuItem>
            <MenuItem icon={<Icon as={FiUser} />} onClick={handleViewProfile}>
              View Publisher Profile
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Text mb={3}>{answer.content}</Text>

      {/* Show images if present */}
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
          <IconButton aria-label="Upvote" icon={<FiArrowUp />} variant="ghost" size="sm" onClick={() => handleVote(1)} />
          <Text>{votes.upvotes}</Text>
        </HStack>
        <HStack spacing={1} mr={4}>
          <IconButton aria-label="Downvote" icon={<FiArrowDown />} variant="ghost" size="sm" onClick={() => handleVote(2)} />
          <Text>{votes.downvotes}</Text>
        </HStack>
        <Spacer />
        <Text fontSize="xs" color="gray.500">{new Date(answer.created_at).toLocaleString()}</Text>
      </Flex>
    </Box>
  );
};

export default AnswerCard; 