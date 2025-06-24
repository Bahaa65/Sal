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
  const [searchTerm, setSearchTerm] = useState('');

  // Use useQuery to fetch questions
  const { data: questions, isLoading, isError, error } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  });

  // Sort and filter questions by vote score and search term
  useEffect(() => {
    if (questions) {
      let filtered = questions;
      
      // Filter by search term
      if (searchTerm.trim()) {
        filtered = questions.filter((question: any) => 
          question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (question.user.job && question.user.job.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Sort by vote score
      const sorted = filtered.sort((a: any, b: any) => {
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
        return scoreB - scoreA; // Descending order (highest first)
      });
      
      setSortedQuestions(sorted);
    } else {
      setSortedQuestions([]);
    }
  }, [questions, searchTerm]);

  // Handle search change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

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
    <MainLayout onSearchChange={handleSearchChange} showSearch={true}>
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

        {searchTerm && (
          <Box my={4} p={3} bg="blue.50" borderRadius="md">
            <Text fontSize="sm" color="blue.700">
              Showing {sortedQuestions.length} result{sortedQuestions.length !== 1 ? 's' : ''} for "{searchTerm}"
            </Text>
          </Box>
        )}

        {sortedQuestions.length === 0 && !isLoading && !isError && (
          <Box my={8} p={6} bg="white" borderRadius="lg" textAlign="center">
            <Text fontSize="lg" color="gray.500">
              {searchTerm ? 'No questions found matching your search.' : 'No questions available.'}
            </Text>
          </Box>
        )}

        {sortedQuestions && sortedQuestions.map((q: any) => (
          <QuestionCard key={q.id} question={q} />
        ))}

        <QuestionModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleAddQuestion}
          isSubmitting={mutation.isPending}
        />
      </Container>
    </MainLayout>
  );
};

export default Home;