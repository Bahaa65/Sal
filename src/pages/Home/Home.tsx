import { Box, Container, useDisclosure, Spinner, Flex, Text, Button, Skeleton, Stack, useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import MainLayout from '../../components/home/MainLayout';
import AskQuestionBox from '../../components/home/AskQuestionBox';
import QuestionModal from '../../components/home/QuestionModal';
import QuestionCard from '../../components/home/QuestionCard';
import apiClient from '../../services/apiClient';
import { useInfiniteQuestionsQuery } from '../../hooks/useInfiniteQuestionsQuery';
import { useInfiniteAnswersQuery } from '../../hooks/useInfiniteAnswersQuery';
import { Question } from '../../types/Question';
import { useInView } from 'react-intersection-observer';
import { useProfileQuery } from '../../hooks/useProfileQuery';

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
  const toast = useToast();
  const { data: profile } = useProfileQuery();

  // Use useInfiniteQuestionsQuery to fetch questions
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuestionsQuery();
  const questions = data ? data.pages.flatMap(page => page.data) : [];

  // Sort and filter questions by vote score and search term
  useEffect(() => {
    if (questions) {
      console.log('searchTerm:', searchTerm);
      let filtered = questions;
      if (searchTerm.trim()) {
        const search = searchTerm.trim().toLowerCase();
        filtered = questions.filter((question: any) => {
          const content = (question.content || '').toString().trim().toLowerCase();
          const firstName = (question.user?.first_name || '').toString().trim().toLowerCase();
          const lastName = (question.user?.last_name || '').toString().trim().toLowerCase();
          const job = (question.user?.job || '').toString().trim().toLowerCase();
          const match =
            content.includes(search) ||
            firstName.includes(search) ||
            lastName.includes(search) ||
            job.includes(search);
          if (match) {
            console.log('MATCH:', { content, firstName, lastName, job, search });
          }
          return match;
        });
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
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      if (profile?.username) {
        queryClient.invalidateQueries({ queryKey: ['user-questions-infinite', profile.username] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['user-questions-infinite'] });
      }
      onClose();
      toast({
        title: 'Question added!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to add question',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleAddQuestion = (newQuestionData: { content: string }) => {
    mutation.mutate(newQuestionData);
  };

  const { ref, inView } = useInView({ triggerOnce: false });

  // Fetch next page when inView changes to true
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Prefetch profile and notifications data for instant navigation
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const { data } = await apiClient.get('/profile');
        return data.data;
      },
      staleTime: 1000 * 60 * 10,
    });
    queryClient.prefetchQuery({
      queryKey: ['notifications', 1],
      queryFn: async () => {
        const { data } = await apiClient.get('/notifications?page=1');
        return data;
      },
      staleTime: 1000 * 60 * 2,
    });
  }, [queryClient]);

  return (
    <MainLayout
      onSearchChange={handleSearchChange}
      showSearch={true}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <Container maxW="container.md" py={8}>
        <AskQuestionBox onClick={onOpen} />

        {isLoading && (
          <Stack spacing={6} py={10}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height="80px" borderRadius="lg" />
            ))}
          </Stack>
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

        {sortedQuestions && sortedQuestions.map((q: Question) => (
          <QuestionCard key={q.id} question={{ ...q, answers_count: q.answers_count ?? 0 }} />
        ))}

        {/* Infinite scroll observer */}
        {hasNextPage && (
          <div ref={ref} style={{ height: 1 }} />
        )}

        {/* Fallback Load More button if needed */}
        {hasNextPage && !inView && (
          <Flex justify="center" mt={6}>
            <Button onClick={() => fetchNextPage()} isLoading={isFetchingNextPage}>
              Load More
            </Button>
      </Flex>
        )}

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