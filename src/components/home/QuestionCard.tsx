import {
  Box,
  Flex,
  Avatar,
  Text,
  IconButton,
  HStack,
  Spacer,
  useDisclosure,
  Button,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
} from "@chakra-ui/react";
import {
  FiArrowUp,
  FiArrowDown,
  FiMessageCircle,
  FiEdit,
  FiMoreVertical,
  FiUser,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import AnswerModal from "./AnswerModal";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { voteQuestion, deleteQuestion } from '../../services/apiClient';
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useInfiniteAnswersQuery } from '../../hooks/useInfiniteAnswersQuery';
import { useInView } from 'react-intersection-observer';
import { Answer } from '../../types/Answer';
import AnswerCard from './AnswerCard';
import { formatRelativeTime } from '../../utils/format';

// Assuming a User type similar to what's in AuthContext
// This could be imported from a shared types file in a larger app
type User = {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  job?: string;
  username?: string;
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
    job_title?: string;
    viewer_vote?: boolean | null; // true for upvote, false for downvote, null for no vote
  };
};

const QuestionCard = ({ question }: QuestionCardProps) => {
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const [showAnswers, setShowAnswers] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [answerSearchTerm, setAnswerSearchTerm] = useState('');
  const navigate = useNavigate();
  const [votes, setVotes] = useState({ upvotes: question.upvotes, downvotes: question.downvotes });
  const [userVote, setUserVote] = useState<boolean | null>(question.viewer_vote || null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const auth = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { ref: answersRef, inView: answersInView } = useInView({ triggerOnce: false });
  const {
    data: answersData,
    isLoading: isLoadingAnswers,
    isError: isErrorAnswers,
    fetchNextPage: fetchNextAnswersPage,
    hasNextPage: hasNextAnswersPage,
    isFetchingNextPage: isFetchingNextAnswersPage,
  } = useInfiniteAnswersQuery(question.id);
  const answers = answersData ? answersData.pages.flatMap(page => page.data) : [];

  // Check if current user is the question owner
  const isQuestionOwner = auth.user?.id === question.user.id;
  
  // Debug logging
  console.log('Current user:', auth.user);
  console.log('Current user ID:', auth.user?.id);
  console.log('Question user ID:', question.user.id);
  console.log('Is question owner:', isQuestionOwner);

  // Update votes when question data changes
  useEffect(() => {
    setVotes({ upvotes: question.upvotes, downvotes: question.downvotes });
    setUserVote(question.viewer_vote || null);
  }, [question.upvotes, question.downvotes, question.viewer_vote]);

  // Fetch next page of answers when inView changes to true
  useEffect(() => {
    if (answersInView && hasNextAnswersPage && !isFetchingNextAnswersPage && showAnswers) {
      fetchNextAnswersPage();
    }
  }, [answersInView, hasNextAnswersPage, isFetchingNextAnswersPage, fetchNextAnswersPage, showAnswers]);

  const handleToggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const handleHide = () => {
    setHidden(true);
  };

  const handleViewProfile = () => {
    navigate(`/users/${question.user.username || question.user.id}`);
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

        await voteQuestion(question.id, 0);
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

        await voteQuestion(question.id, vote);
        toast({
          title: vote === 1 ? 'Upvoted!' : 'Downvoted!',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
        });
      }

      // Invalidate questions query to trigger re-sorting
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    } catch (e) {
      console.error('Vote error:', e);
      // Revert optimistic update on error
      setVotes({ upvotes: question.upvotes, downvotes: question.downvotes });
      setUserVote(question.viewer_vote || null);
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
      await deleteQuestion(question.id);
      toast({
        title: 'Question deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      // Invalidate questions query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      // Hide the question card
      setHidden(true);
      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.error('Error deleting question:', e);
      toast({
        title: 'Error deleting question',
        description: 'An error occurred while deleting the question',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
      setIsDeleteDialogOpen(false);
    }
  };

  if (hidden) return null;

  // Sort and filter answers by vote score and search term
  const sortedAnswers = answers ? [...answers]
    .filter((answer: Answer) => {
      if (!answerSearchTerm.trim()) return true;
      return (
        answer.content.toLowerCase().includes(answerSearchTerm.toLowerCase()) ||
        answer.user.first_name.toLowerCase().includes(answerSearchTerm.toLowerCase()) ||
        answer.user.last_name.toLowerCase().includes(answerSearchTerm.toLowerCase())
      );
    })
    .sort((a: Answer, b: Answer) => {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
      return scoreB - scoreA; // Descending order (highest first)
    }) : [];

  return (
    <Box
      cursor="pointer"
      _hover={{ boxShadow: 'lg', bg: 'gray.50' }}
      transition="box-shadow 0.2s, background 0.2s"
      position="relative"
      mb={4}
    >
      <Box bg="white" borderRadius="lg" boxShadow="md" p={4} mb={6}>
        <Flex align="center" mb={3}>
          <Avatar name={`${question.user.first_name} ${question.user.last_name}`} src={question.user.avatar} mr={3} />
          <Box>
            <Text fontWeight="bold" fontSize="md">{`${question.user.first_name} ${question.user.last_name}`}</Text>
            <Text fontSize="sm" color="gray.500">{question.job_title || question.user.job || 'No job title'}</Text>
          </Box>
          <Spacer />
          <Menu>
            <MenuButton as={IconButton} icon={<Icon as={FiMoreVertical} />} variant="ghost" size="sm" />
            <MenuList>
              <MenuItem icon={<Icon as={FiX} />} onClick={handleHide}>
                Hide Question
              </MenuItem>
              <MenuItem icon={<Icon as={FiUser} />} onClick={handleViewProfile}>
                View Publisher Profile
              </MenuItem>
              {isQuestionOwner && (
                <MenuItem icon={<Icon as={FiTrash2} />} onClick={() => setIsDeleteDialogOpen(true)}>
                  Delete Question
                </MenuItem>
              )}
              {/* Temporary: Always show delete option for debugging */}
              <MenuItem icon={<Icon as={FiTrash2} />} onClick={() => setIsDeleteDialogOpen(true)}>
                Delete Question (Debug)
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="medium" mb={2} cursor="pointer" onClick={() => navigate(`/questions/${question.id}`)}>
            {question.content}
          </Text>
        </Box>

        <Flex align="center" fontSize="sm" color="gray.600">
          <HStack spacing={1} mr={4}>
            <IconButton 
              aria-label="Upvote" 
              icon={<FiArrowUp />} 
              variant={userVote === true ? "solid" : "ghost"}
              colorScheme={userVote === true ? "blue" : "gray"}
              size="sm" 
              onClick={() => handleVote(1)} 
            />
            <Text>{votes.upvotes}</Text>
          </HStack>
          <HStack spacing={1} mr={4}>
            <IconButton 
              aria-label="Downvote" 
              icon={<FiArrowDown />} 
              variant={userVote === false ? "solid" : "ghost"}
              colorScheme={userVote === false ? "red" : "gray"}
              size="sm" 
              onClick={() => handleVote(2)} 
            />
            <Text>{votes.downvotes}</Text>
          </HStack>
          <HStack spacing={1} mr={4} cursor="pointer">
            <IconButton
              aria-label={showAnswers ? "Hide Answers" : "Show Answers"}
              icon={<FiMessageCircle />}
              variant={showAnswers ? "solid" : "ghost"}
              colorScheme={showAnswers ? "blue" : "gray"}
              size="sm"
              onClick={handleToggleAnswers}
            />
            <Text>{question.answers_count} Answers</Text>
          </HStack>
          <Spacer />
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            {formatRelativeTime(question.created_at)}
          </Text>
        </Flex>

        {showAnswers && (
          <Box mt={4} mb={2}>
            <Flex align="center" alignItems="center">
              <Avatar size="sm" name={auth.user ? auth.user.first_name + ' ' + auth.user.last_name : 'You'} src={auth.user?.avatar} mr={2} height="48px" width="48px" />
              <Input
                placeholder="Write your answer"
                isReadOnly
                onClick={onOpen}
                borderRadius="full"
                bg="gray.50"
                maxW="700px"
                flex={1}
                height="48px"
              />
            </Flex>
          </Box>
        )}

        {showAnswers && (
          <Box mt={2}>
            {isLoadingAnswers ? (
              <Spinner />
            ) : isErrorAnswers ? (
              <Text color="red.500">Error loading answers.</Text>
            ) : (
              sortedAnswers.map((answer: Answer) => (
                <AnswerCard key={answer.id} answer={answer} />
              ))
            )}
            {hasNextAnswersPage && (
              <div ref={answersRef} style={{ height: 1 }} />
            )}
            {hasNextAnswersPage && !isFetchingNextAnswersPage && (
              <Button onClick={() => fetchNextAnswersPage()} mt={2} size="sm">
                Load More Answers
              </Button>
            )}
          </Box>
        )}
      </Box>
      <AnswerModal isOpen={isModalOpen} onClose={onClose} questionId={question.id} />
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                isLoading={isLoadingAnswers}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default QuestionCard; 