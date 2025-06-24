import { Box, Container, useDisclosure, Spinner, Flex, Text } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import MainLayout from '../../components/home/MainLayout';
import AskQuestionBox from '../../components/home/AskQuestionBox';
import QuestionModal from '../../components/home/QuestionModal';
import QuestionCard from '../../components/home/QuestionCard';
import apiClient from '../../services/apiClient';

// Define the function to fetch questions
const fetchQuestions = async () => {
  const { data } = await apiClient.get('/questions');
  if (data && data.success) {
    return data.data; // The backend returns questions in a 'data' property
  }
  throw new Error('Failed to fetch questions');
};

// Define the function to add a new question
const addQuestion = async (newQuestion: { content: string }) => {
  const { data } = await apiClient.post('/questions', newQuestion);
  return data;
};

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const [sortedQuestions, setSortedQuestions] = useState<any[]>([]);

  // Use useQuery to fetch questions
  const { data: questions, isLoading, isError, error } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  });

  // Sort questions by vote score whenever questions data changes
  useEffect(() => {
    if (questions) {
      const sorted = [...questions].sort((a, b) => {
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
        return scoreB - scoreA; // Descending order (highest first)
      });
      setSortedQuestions(sorted);
    } else {
      setSortedQuestions([]);
    }
  }, [questions]);

  // Use useMutation to add a new question
  const mutation = useMutation({
    mutationFn: addQuestion,
    onSuccess: () => {
      // When a new question is added successfully, invalidate the 'questions' query
      // This will cause React Query to refetch the questions and update the UI
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      onClose(); // Close the modal
    },
    // You can also add onError to handle mutation errors with a toast, for example
  });

  const handleAddQuestion = (newQuestionData: { content: string }) => {
    mutation.mutate(newQuestionData);
  };

  return (
    <MainLayout>
      <Container maxW="container.md" py={8}>
        <AskQuestionBox onClick={onOpen} />

        {isLoading && (
          <Flex justify="center" align="center" py={10}>
            <Spinner size="xl" />
          </Flex>
        )}

        {isError && (
          <Box my={4} p={4} bg="red.100" borderRadius="md">
            <Text color="red.700">Error fetching questions: {error.message}</Text>
          </Box>
        )}

        {sortedQuestions && sortedQuestions.map((q: any) => (
          <QuestionCard key={q.id} question={q} />
        ))}

        <QuestionModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleAddQuestion}
          isSubmitting={mutation.isPending} // Pass mutation loading state to modal
        />
      </Container>
    </MainLayout>
  );
};

export default Home;