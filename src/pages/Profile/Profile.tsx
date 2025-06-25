import { useParams } from "react-router-dom";
import {
  Box,
  Avatar,
  Text,
  Button,
  Flex,
  VStack,
  Spinner,
  useDisclosure,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import MainLayout from '../../components/home/MainLayout';
import EditProfileModal from './EditProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfileQuery } from '../../hooks/useProfileQuery';
import { useUserProfileQuery } from '../../hooks/useUserProfileQuery';
import { useProfilePageData } from '../../hooks/useProfilePageData';

const Profile = () => {
  const { username } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading, error, refetch } = username
    ? useUserProfileQuery(username)
    : useProfileQuery();

  const profilePageData = useProfilePageData(username);
  const {
    questions, questionsLoading, fetchNextPage, hasNextPage, isFetchingNextPage, ref, inView,
    answers, answersLoading, fetchNextAnswersPage, hasNextAnswersPage, isFetchingNextAnswersPage, answersRef, answersInView
  } = profilePageData;

  if (isLoading) {
    return (
      <MainLayout>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" />
        </Flex>
      </MainLayout>
    );
  }

  if (error || (!profile && !username)) {
    return <MainLayout><Text color="red.500">Unable to load profile.</Text></MainLayout>;
  }

  const userToShow = username ? profile : profile;
  if (!userToShow) {
    return <MainLayout><Text color="red.500">Unable to load profile.</Text></MainLayout>;
  }
  const fullName = userToShow.full_name || `${userToShow.first_name} ${userToShow.last_name}`;

  return (
    <MainLayout>
      <Box maxW="600px" mx="auto" mt={8} p={6} bg="white" borderRadius="lg" boxShadow="md">
        <Flex direction="column" align="center">
          <Avatar size="2xl" name={fullName} src={userToShow.avatar} mb={4} />
          <Text fontSize="lg" color="gray.500">@{userToShow.username}</Text>
          <Text fontWeight="bold" fontSize="2xl" mt={2}>{fullName}</Text>
          <Text color="gray.600" fontSize="md">{userToShow.job || "No job title"}</Text>
          <Text color="gray.500" mt={2}>{userToShow.bio}</Text>
          {!username && (
            <Button mt={4} colorScheme="blue" onClick={onOpen}>Edit Profile</Button>
          )}
          {!username && (
            <Button mt={2} colorScheme="red" variant="outline" onClick={() => { logout(); navigate('/login'); }}>
             Logout
            </Button>
          )}
          {username && (
            <Box mt={2} mb={2} px={3} py={1} bg="gray.100" borderRadius="full" fontSize="sm" color="gray.600">
              User Profile
            </Box>
          )}
        </Flex>
        {/* Questions section */}
        <Box mt={10}>
          <Text fontWeight="bold" fontSize="xl" mb={4}>Questions</Text>
          {questionsLoading ? (
            <Stack spacing={6} py={6}>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height="60px" borderRadius="lg" />
              ))}
            </Stack>
          ) : (questions.length === 0 ? (
            <Text color="gray.500">No questions yet.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {questions.map((q) => (
                <Box key={q.id} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                  <Text fontWeight="bold" mb={2}>{q.content}</Text>
                  <Text fontSize="sm" color="gray.500">{new Date(q.created_at).toLocaleString()}</Text>
                </Box>
              ))}
              {/* Infinite scroll observer for user questions */}
              {hasNextPage && ref && <div ref={ref} style={{ height: 1 }} />}
              {/* Fallback Load More button for user questions */}
              {hasNextPage && !inView && fetchNextPage && (
                <Flex justify="center" mt={4}>
                  <Button onClick={() => fetchNextPage && fetchNextPage()} isLoading={!!isFetchingNextPage}>
                    Load More Questions
                  </Button>
                </Flex>
              )}
            </VStack>
          ))}
        </Box>
        {/* Answers section (only for user profiles) */}
        {username && (
          <Box mt={10}>
            <Text fontWeight="bold" fontSize="xl" mb={4}>Answers</Text>
            {answersLoading ? (
              <Stack spacing={6} py={6}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height="60px" borderRadius="lg" />
                ))}
              </Stack>
            ) : (answers.length === 0 ? (
              <Text color="gray.500">No answers yet.</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {answers.map((a) => (
                  <Box key={a.id} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                    <Text fontWeight="bold" mb={2}>{a.content}</Text>
                    <Text fontSize="sm" color="gray.500">{new Date(a.created_at).toLocaleString()}</Text>
                  </Box>
                ))}
                {/* Infinite scroll observer for user answers */}
                {hasNextAnswersPage && answersRef && <div ref={answersRef} style={{ height: 1 }} />}
                {/* Fallback Load More button for user answers */}
                {hasNextAnswersPage && !answersInView && fetchNextAnswersPage && (
                  <Flex justify="center" mt={4}>
                    <Button onClick={() => fetchNextAnswersPage && fetchNextAnswersPage()} isLoading={!!isFetchingNextAnswersPage}>
                      Load More Answers
                    </Button>
                  </Flex>
                )}
              </VStack>
            ))}
          </Box>
        )}
        {!username && (
          <EditProfileModal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              refetch();
            }}
            user={profile}
            onProfileUpdated={() => refetch()}
          />
        )}
      </Box>
    </MainLayout>
  );
};

export default Profile; 