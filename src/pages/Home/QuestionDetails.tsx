import React, { useState, useRef } from 'react';
import { Box, Button, Flex, Avatar, Text, Input, IconButton, VStack, HStack, useToast, Skeleton, Divider, Menu, MenuButton, MenuList, MenuItem, Spacer, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FiArrowUp, FiArrowDown, FiMoreVertical, FiUser, FiX, FiTrash2 } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainLayout from '../../components/home/MainLayout';
import AnswerCard from '../../components/home/AnswerCard';
import AnswerModal from '../../components/home/AnswerModal';
import apiClient, { voteQuestion, deleteQuestion } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';

const fetchQuestion = async (id: string) => {
  const { data } = await apiClient.get(`/questions/${id}`);
  return data.data;
};
const fetchAnswers = async (id: string) => {
  const { data } = await apiClient.get(`/questions/${id}/answers`);
  return data.data;
};

const QuestionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: question, isLoading: loadingQuestion } = useQuery({
    queryKey: ['question', id],
    queryFn: () => fetchQuestion(id!),
    enabled: !!id,
  });
  const { data: answers, isLoading: loadingAnswers } = useQuery({
    queryKey: ['answers', id],
    queryFn: () => fetchAnswers(id!),
    enabled: !!id,
  });
  const [votes, setVotes] = useState({ upvotes: question?.upvotes || 0, downvotes: question?.downvotes || 0 });
  const [userVote, setUserVote] = useState<boolean | null>(question?.viewer_vote || null);
  React.useEffect(() => {
    if (question) {
      setVotes({ upvotes: question.upvotes, downvotes: question.downvotes });
      setUserVote(question.viewer_vote || null);
    }
  }, [question]);
  const handleVote = async (vote: 1 | 2) => {
    if (!question) return;
    try {
      const optimisticVotes = { ...votes };
      if ((vote === 1 && userVote === true) || (vote === 2 && userVote === false)) {
        if (userVote === true) optimisticVotes.upvotes -= 1;
        if (userVote === false) optimisticVotes.downvotes -= 1;
        setVotes(optimisticVotes);
        setUserVote(null);
        await voteQuestion(question.id, 0);
        toast({ title: 'Vote removed', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
      } else {
        if (userVote === true) optimisticVotes.upvotes -= 1;
        if (userVote === false) optimisticVotes.downvotes -= 1;
        if (vote === 1) optimisticVotes.upvotes += 1;
        if (vote === 2) optimisticVotes.downvotes += 1;
        setVotes(optimisticVotes);
        setUserVote(vote === 1 ? true : false);
        await voteQuestion(question.id, vote);
        toast({ title: vote === 1 ? 'Upvoted!' : 'Downvoted!', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
      }
      queryClient.invalidateQueries({ queryKey: ['question', id] });
    } catch (e) {
      setVotes({ upvotes: question.upvotes, downvotes: question.downvotes });
      setUserVote(question.viewer_vote || null);
      toast({ title: 'Error', description: 'Failed to vote. Please try again.', status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
    }
  };
  const handleDelete = async () => {
    if (!question) return;
    try {
      await deleteQuestion(question.id);
      toast({ title: 'Question deleted successfully', status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      navigate('/home');
    } catch (e) {
      toast({ title: 'Error deleting question', description: 'An error occurred while deleting the question', status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
    }
    setIsDeleteDialogOpen(false);
  };
  const isQuestionOwner = user && question && user.id === question.user.id;
  const handleViewProfile = () => {
    if (question) navigate(`/users/${question.user.username || question.user.id}`);
  };
  return (
    <MainLayout>
      <Flex justify="center" mt={8}>
        <Box w={["100%", "90%", "700px"]} bg="white" borderRadius="xl" boxShadow="md" p={6}>
          <Button leftIcon={<ArrowBackIcon />} variant="ghost" mb={4} onClick={() => navigate(-1)}>
            Back
          </Button>
          {loadingQuestion ? (
            <Skeleton height="200px" borderRadius="lg" />
          ) : question ? (
            <Box>
              {/* تصميم منفصل للسؤال */}
              <Flex align="center" mb={3}>
                <Avatar name={question.user.full_name || question.user.username} src={question.user.avatar} mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="md">{question.user.full_name || question.user.username}</Text>
                  <Text fontSize="sm" color="gray.500">{question.user.job || 'No job title'}</Text>
                </Box>
                <Spacer />
                <Menu>
                  <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" size="sm" />
                  <MenuList>
                    <MenuItem icon={<FiX />} onClick={() => navigate('/home')}>Hide Question</MenuItem>
                    <MenuItem icon={<FiUser />} onClick={handleViewProfile}>View Publisher Profile</MenuItem>
                    {isQuestionOwner && (
                      <MenuItem icon={<FiTrash2 />} onClick={() => setIsDeleteDialogOpen(true)}>Delete Question</MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </Flex>
              <Text fontSize="xl" fontWeight="semibold" mb={2}>{question.content}</Text>
              <Text color="gray.500" fontSize="sm" mb={2}>{question.created_at && new Date(question.created_at).toLocaleString()}</Text>
              <HStack spacing={6} mb={4}>
                <HStack>
                  <IconButton aria-label="Upvote" icon={<FiArrowUp />} variant={userVote === true ? "solid" : "ghost"} colorScheme={userVote === true ? "blue" : "gray"} size="sm" onClick={() => handleVote(1)} />
                  <Text>{votes.upvotes}</Text>
                </HStack>
                <HStack>
                  <IconButton aria-label="Downvote" icon={<FiArrowDown />} variant={userVote === false ? "solid" : "ghost"} colorScheme={userVote === false ? "red" : "gray"} size="sm" onClick={() => handleVote(2)} />
                  <Text>{votes.downvotes}</Text>
                </HStack>
                <HStack>
                  <Text color="blue.600">💬</Text>
                  <Text>{question.answers_count || 0}</Text>
                </HStack>
              </HStack>
              <Divider mb={4} />
              {/* إدخال الإجابة: فقط لفتح AnswerModal */}
              <Flex align="center" mb={6}>
                <Avatar size="sm" name={user ? user.first_name + ' ' + user.last_name : 'You'} src={user?.avatar} mr={2} />
                <Input
                  placeholder="Write your answer"
                  isReadOnly
                  onClick={onOpen}
                  borderRadius="full"
                  bg="gray.50"
                  mr={2}
                />
              </Flex>
              <AnswerModal isOpen={isOpen} onClose={onClose} questionId={question.id} />
              {/* قائمة الإجابات */}
              <VStack align="stretch" spacing={4}>
                {loadingAnswers ? (
                  <Skeleton height="60px" borderRadius="md" />
                ) : answers && answers.length > 0 ? (
                  answers.map((ans: any) => <AnswerCard key={ans.id} answer={ans} />)
                ) : (
                  <Text color="gray.400" textAlign="center">No answers yet.</Text>
                )}
              </VStack>
              {/* حوار تأكيد الحذف */}
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
                      <Button colorScheme="red" onClick={handleDelete} ml={3}>
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Box>
          ) : (
            <Text color="red.500">Question not found.</Text>
          )}
        </Box>
      </Flex>
    </MainLayout>
  );
};

export default QuestionDetails; 