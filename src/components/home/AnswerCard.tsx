import { Box, Flex, Avatar, Text, IconButton, HStack, Spacer, Menu, MenuButton, MenuList, MenuItem, Icon, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from '@chakra-ui/react';
import { FiMoreVertical, FiUser, FiX, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { voteAnswer, deleteAnswer } from '../../services/apiClient';
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

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
  viewer_vote?: boolean | null; // true for upvote, false for downvote, null for no vote
};

type AnswerCardProps = {
  answer: Answer;
  questionId?: number;
};

const AnswerCard = ({ answer, questionId }: AnswerCardProps) => {
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();
  const [votes, setVotes] = useState({ upvotes: answer.upvotes, downvotes: answer.downvotes });
  const [userVote, setUserVote] = useState<boolean | null>(answer.viewer_vote || null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const auth = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Check if current user is the answer owner
  const isAnswerOwner = auth.user?.id === answer.user.id;
  
  // Debug logging
  console.log('Current user:', auth.user);
  console.log('Current user ID:', auth.user?.id);
  console.log('Answer user ID:', answer.user.id);
  console.log('Is answer owner:', isAnswerOwner);

  // Update votes when answer data changes
  useEffect(() => {
    setVotes({ upvotes: answer.upvotes, downvotes: answer.downvotes });
    setUserVote(answer.viewer_vote || null);
  }, [answer.upvotes, answer.downvotes, answer.viewer_vote]);

  const handleHide = () => {
    setHidden(true);
  };
  const handleViewProfile = () => {
    navigate(`/users/${answer.user.username || answer.user.id}`);
  };

  const handleVote = async (vote: 1 | 2) => {
    try {
      // Optimistic update - update UI immediately
      const optimisticVotes = { ...votes };

      // If user already voted the same way, remove the vote (vote: 0)
      if ((vote === 1 && userVote === true) || (vote === 2 && userVote === false)) {
        // Optimistic update
        if (userVote === true) optimisticVotes.upvotes -= 1;
        if (userVote === false) optimisticVotes.downvotes -= 1;
        setVotes(optimisticVotes);
        setUserVote(null);

        await voteAnswer(answer.id, 0);
        toast({
          title: 'Vote removed',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
        });
      } else {
        // If user voted differently or hasn't voted, apply the new vote
        // Optimistic update
        if (userVote === true) optimisticVotes.upvotes -= 1;
        if (userVote === false) optimisticVotes.downvotes -= 1;
        if (vote === 1) optimisticVotes.upvotes += 1;
        if (vote === 2) optimisticVotes.downvotes += 1;
        
        setVotes(optimisticVotes);
        setUserVote(vote === 1 ? true : false);

        await voteAnswer(answer.id, vote);
        toast({
          title: vote === 1 ? 'Upvoted!' : 'Downvoted!',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
        });
      }

      // Invalidate answers query to trigger re-sorting
      queryClient.invalidateQueries({ queryKey: ["answers"] });
    } catch (e) {
      console.error('Vote error:', e);
      // Revert optimistic update on error
      setVotes({ upvotes: answer.upvotes, downvotes: answer.downvotes });
      setUserVote(answer.viewer_vote || null);
      toast({
        title: 'Error',
        description: 'Failed to vote. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnswer(answer.id);
      toast({
        title: 'Answer deleted',
        description: 'The answer has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      queryClient.invalidateQueries({ queryKey: ["answers"] });
      setHidden(true);
      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.error('Delete error:', e);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the answer.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCardClick = () => {
    // Navigate to the question details page using the question ID
    if (questionId) {
      navigate(`/questions/${questionId}`);
    }
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  if (hidden) return null;

  return (
    <Flex align="flex-start" mt={4}>
      <Avatar name={`${answer.user.first_name} ${answer.user.last_name}`} src={answer.user.avatar} size="md" mr={4} mt={2} />
      <Box 
        flex={1}
        borderRadius="lg"
        bg="gray.50"
        p={4}
        boxShadow="none"
        position="relative"
        cursor="pointer"
        _hover={{ bg: 'gray.100' }}
        transition="background 0.2s"
        onClick={handleCardClick}
      >
        <Menu>
          <MenuButton 
            as={IconButton}
            icon={<Icon as={FiMoreVertical} color="blue.500" boxSize={7} />} 
            variant="ghost"
            size="md"
            position="absolute"
            top={3}
            right={3}
            aria-label="Options"
            onClick={(e) => handleButtonClick(e, () => {})}
          />
          <MenuList>
            <MenuItem icon={<Icon as={FiX} />} onClick={(e) => handleButtonClick(e, handleHide)}>
              Hide Comment
            </MenuItem>
            <MenuItem icon={<Icon as={FiUser} />} onClick={(e) => handleButtonClick(e, handleViewProfile)}>
              View Publisher Profile
            </MenuItem>
            {isAnswerOwner && (
              <MenuItem icon={<Icon as={FiTrash2} />} onClick={(e) => handleButtonClick(e, () => setIsDeleteDialogOpen(true))}>
                Delete Answer
              </MenuItem>
            )}
            {/* Temporary: Always show delete option for debugging */}
            <MenuItem icon={<Icon as={FiTrash2} />} onClick={(e) => handleButtonClick(e, () => setIsDeleteDialogOpen(true))}>
              Delete Answer
            </MenuItem>
          </MenuList>
        </Menu>
        <Text fontWeight="bold" fontSize="sm">{`${answer.user.first_name} ${answer.user.last_name}`}</Text>
        <Text fontSize="xs" color="gray.500">{answer.user.job || 'No job title'}</Text>
        <Text mb={3}>{answer.content}</Text>
        <Flex align="center" fontSize="sm" color="gray.600">
          <Spacer />
          <Text fontSize="xs" color="gray.500">{new Date(answer.created_at).toLocaleString()}</Text>
        </Flex>
        <Flex align="center" fontSize="sm" color="gray.600">
          <HStack spacing={6} color="blue.500" fontSize="lg">
            <HStack>
              <Icon 
                as={FaArrowUp} 
                boxSize={5} 
                cursor="pointer"
                onClick={(e) => handleButtonClick(e, () => handleVote(1))}
                color={userVote === true ? "blue.500" : "gray.400"}
                _hover={{ color: "blue.600" }}
              />
              <Text>{votes.upvotes}</Text>
            </HStack>
            <HStack>
              <Icon 
                as={FaArrowDown} 
                boxSize={5} 
                cursor="pointer"
                onClick={(e) => handleButtonClick(e, () => handleVote(2))}
                color={userVote === false ? "blue.500" : "gray.400"}
                _hover={{ color: "blue.600" }}
              />
            </HStack>
          </HStack>
        </Flex>
      </Box>
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this answer? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={(e) => handleButtonClick(e, () => setIsDeleteDialogOpen(false))}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={(e) => handleButtonClick(e, handleDelete)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default AnswerCard; 