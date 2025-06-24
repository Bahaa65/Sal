import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import apiClient from "../../services/apiClient";
import MainLayout from '../../components/home/MainLayout';
import EditProfileModal from './EditProfileModal';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data;
        if (username) {
          const res = await apiClient.get(`/users/${username}`);
          data = res.data.data;
        } else {
          const res = await apiClient.get("/profile");
          data = res.data.data;
        }
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user?.username) return;
      setLoadingQuestions(true);
      try {
        const { data } = await apiClient.get(`/users/${user.username}/questions`);
        setQuestions(data.data || []);
      } catch (error) {
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    if (user?.username) fetchQuestions();
  }, [user?.username]);

  const refetchProfile = async () => {
    setLoading(true);
    try {
      let data;
      if (username) {
        const res = await apiClient.get(`/users/${username}`);
        data = res.data.data;
      } else {
        const res = await apiClient.get("/profile");
        data = res.data.data;
      }
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" />
        </Flex>
      </MainLayout>
    );
  }

  if (!user) {
    return <MainLayout><Text color="red.500">Unable to load profile.</Text></MainLayout>;
  }

  return (
    <MainLayout>
      <Box maxW="600px" mx="auto" mt={8} p={6} bg="white" borderRadius="lg" boxShadow="md">
        <Flex direction="column" align="center">
          <Avatar size="2xl" name={user.full_name} src={user.avatar} mb={4} />
          <Text fontSize="lg" color="gray.500">@{user.username}</Text>
          <Text fontWeight="bold" fontSize="2xl" mt={2}>{user.full_name}</Text>
          <Text color="gray.600" fontSize="md">{user.job || "No job title"}</Text>
          <Text color="gray.500" mt={2}>{user.bio}</Text>
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
          {loadingQuestions ? (
            <Flex justify="center" align="center" py={6}><Spinner /></Flex>
          ) : questions.length === 0 ? (
            <Text color="gray.500">No questions yet.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {questions.map((q) => (
                <Box key={q.id} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                  <Text fontWeight="bold" mb={2}>{q.content}</Text>
                  <Text fontSize="sm" color="gray.500">{new Date(q.created_at).toLocaleString()}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
        {!username && (
          <EditProfileModal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              refetchProfile();
            }}
            user={user}
            onProfileUpdated={setUser}
          />
        )}
      </Box>
    </MainLayout>
  );
};

export default Profile; 