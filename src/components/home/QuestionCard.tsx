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
  useToast,
} from "@chakra-ui/react";
import { UpDownIcon } from "@chakra-ui/icons";
import {
  FiArrowUp,
  FiArrowDown,
  FiMessageCircle,
  FiEdit,
  FiMoreVertical,
  FiUser,
  FiEye,
  FiFlag,
  FiX,
} from "react-icons/fi";
import AnswerModal from "./AnswerModal";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import AnswerCard from "./AnswerCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [isReporting, setIsReporting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: answers,
    isLoading: isLoadingAnswers,
    isError,
  } = useQuery<Answer[]>({
    queryKey: ["answers", question.id],
    queryFn: () => fetchAnswers(question.id),
    enabled: showAnswers, // Only fetch when showAnswers is true
  });

  const handleToggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const handleReport = async () => {
    if (!window.confirm("هل أنت متأكد أنك تريد الإبلاغ عن هذا السؤال؟")) return;
    setIsReporting(true);
    try {
      await apiClient.post("/report/question", { question_id: question.id });
      toast({ title: "تم إرسال الإبلاغ بنجاح.", status: "success" });
    } catch (e) {
      toast({ title: "حدث خطأ أثناء الإبلاغ.", status: "error" });
    } finally {
      setIsReporting(false);
    }
  };

  const handleHide = () => {
    setHidden(true);
  };

  const handleViewProfile = () => {
    navigate(`/users/${question.user.username || question.user.id}`);
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
            <IconButton aria-label="Upvote" icon={<FiArrowUp />} variant="ghost" size="sm" />
            <Text>{question.upvotes}</Text>
          </HStack>
          <HStack spacing={1} mr={4}>
            <IconButton aria-label="Downvote" icon={<FiArrowDown />} variant="ghost" size="sm" />
            <Text>{question.downvotes}</Text>
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
            {answers && answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </Box>
        </Collapse>
      </Box>
      <AnswerModal isOpen={isModalOpen} onClose={onClose} questionId={question.id} />
    </>
  );
};

export default QuestionCard; 