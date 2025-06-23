import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Textarea,
  useToast,
  Text,
  Flex,
  Avatar,
  Box,
  Link,
  Icon,
} from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import { useState } from "react";
import { MdPhoto } from "react-icons/md";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
}

const AnswerModal = ({ isOpen, onClose, questionId }: AnswerModalProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newAnswer: { content: string }) =>
      apiClient.post(`/answers`, { content: newAnswer.content, question_id: questionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({
        title: "Answer submitted.",
        description: "Your answer has been posted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setContent("");
    },
    onError: (error: any) => {
      console.error("Error submitting answer:", error);
      if (error.response) {
        console.log("Server response:", error.response.data);
      }
      toast({
        title: "An error occurred.",
        description:
          error.response?.data?.detail ||
          "Unable to submit your answer. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Answer cannot be empty.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    mutation.mutate({ content });
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center">
            <Avatar size="sm" name={user.username} src={user.avatar} />
            <Text ml={3}>{`${user.first_name} ${user.last_name}`}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Write Answer....."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minH="150px"
          />
          <Box
            mt={3}
            p={2}
            bg="blue.50"
            borderRadius="md"
            border="1px"
            borderColor="blue.100"
          >
            <Text fontSize="sm">
              Note: You can use Markdown to format text.{" "}
              <Link color="blue.500" href="#" isExternal>
                Learn More?
              </Link>
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button leftIcon={<Icon as={MdPhoto} />} variant="ghost">
            Add Photo
          </Button>
          <Flex>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={mutation.isPending}
            >
              Add Answer
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AnswerModal; 