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
  Collapse,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
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
} from "react-icons/fi";
import AnswerModal from "./AnswerModal";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import AnswerCard from "./AnswerCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { voteQuestion } from '../../services/apiClient';
import { useQueryClient } from "@tanstack/react-query";

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

const fetchAnswers = async (questionId: number) => {
  const { data } = await apiClient.get(`/questions/${questionId}/answers`);
  return data.data; // Assuming answers are in a 'data' property
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

  // Update votes when question data changes
  useEffect(() => {
    setVotes({ upvotes: question.upvotes, downvotes: question.downvotes });
    setUserVote(question.viewer_vote || null);
  }, [question.upvotes, question.downvotes, question.viewer_vote]);

  const {
    data: answers,
    isLoading: isLoadingAnswers,
    isError,
  } = useQuery<Answer[]>({
    queryKey: ["answers", question.id],
    queryFn: () => fetchAnswers(question.id),
    enabled: showAnswers, // Only fetch when showAnswers is true
  });

  // Sort and filter answers by vote score and search term
  const sortedAnswers = answers ? [...answers]
    .filter((answer) => {
      if (!answerSearchTerm.trim()) return true;
      return (
        answer.content.toLowerCase().includes(answerSearchTerm.toLowerCase()) ||
        answer.user.first_name.toLowerCase().includes(answerSearchTerm.toLowerCase()) ||
        answer.user.last_name.toLowerCase().includes(answerSearchTerm.toLowerCase()) ||
        (answer.user.job && answer.user.job.toLowerCase().includes(answerSearchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
      return scoreB - scoreA; // Descending order (highest first)
    }) : [];

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
      const optimisticUserVote = userVote;

      // If user already voted the same way, remove the vote (vote: 0)
      if ((vote === 1 && userVote === true) || (vote === 2 && userVote === false)) {
        // Optimistic update
        if (userVote === true) optimisticVotes.upvotes -= 1;
        if (userVote === false) optimisticVotes.downvotes -= 1;
        setVotes(optimisticVotes);
        setUserVote(null);

        await voteQuestion(question.id, 0);
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
      }

      // Invalidate questions query to trigger re-sorting
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    } catch (e) {
      console.error('Vote error:', e);
      // Revert optimistic update on error
      setVotes({ upvotes: question.upvotes, downvotes: question.downvotes });
      setUserVote(question.viewer_vote || null);
    }
  };

  if (hidden) return null;

  return (
    <>
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
            </MenuList>
          </Menu>
        </Flex>

        <Box mb={4}>
          <Text fontSize="lg" fontWeight="medium" mb={2}>{question.content}</Text>
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
          <HStack spacing={1} mr={4} onClick={handleToggleAnswers} cursor="pointer">
            <IconButton
              aria-label="Comments"
              icon={<FiMessageCircle />}
              variant="ghost"
              size="sm"
              isActive={showAnswers}
            />
            <Text>{question.answers_count} Answers</Text>
          </HStack>
          <Spacer />
          <Button
            leftIcon={<FiEdit />}
            size="sm"
            variant="solid"
            colorScheme="blue"
            onClick={onOpen}
          >
            Answer
          </Button>
        </Flex>

        <Collapse in={showAnswers} animateOpacity>
          <Box mt={4}>
            {isLoadingAnswers && <Flex justify="center"><Spinner /></Flex>}
            {isError && <Text color="red.500">Error fetching answers.</Text>}
            
            {!isLoadingAnswers && !isError && answers && answers.length > 0 && (
              <Box mb={4}>
                <Input
                  placeholder="Search in answers..."
                  value={answerSearchTerm}
                  onChange={(e) => setAnswerSearchTerm(e.target.value)}
                  size="sm"
                  bg="white"
                  borderRadius="md"
                />
                {answerSearchTerm && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Found {sortedAnswers.length} answer{sortedAnswers.length !== 1 ? 's' : ''}
                  </Text>
                )}
              </Box>
            )}
            
            {sortedAnswers && sortedAnswers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
            
            {sortedAnswers.length === 0 && !isLoadingAnswers && !isError && answers && answers.length > 0 && (
              <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No answers found matching your search.
                </Text>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
      <AnswerModal isOpen={isModalOpen} onClose={onClose} questionId={question.id} />
    </>
  );
};

export default QuestionCard; 