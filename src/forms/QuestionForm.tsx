import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  Flex,
  Avatar,
  Text,
  VStack,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useAuth } from "../contexts/AuthContext";

type QuestionFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; job_title?: string }) => void;
  isSubmitting?: boolean;
};

const QuestionForm = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: QuestionFormProps) => {
  const [content, setContent] = useState("");
  const { user } = useAuth();

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({ content });
      setContent("");
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader borderBottomWidth="1px" pb={4}>
          <Flex align="center">
            <Avatar
              name={`${user.first_name} ${user.last_name}`}
              src={user.avatar}
              mr={4}
            />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">{`${user.first_name} ${user.last_name}`}</Text>
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Textarea
            placeholder="What is your question?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minH="150px"
          />

          <Box mt={6} p={4} bg="gray.50" borderRadius="md">
            <Flex align="center" mb={2}>
              <QuestionOutlineIcon mr={2} color="blue.500" />
              <Text fontWeight="bold" color="blue.600">
                Tips on getting good answers quickly
              </Text>
            </Flex>
            <VStack align="start" spacing={2} fontSize="sm" color="gray.700">
              <Checkbox isChecked isDisabled>
                Make sure your question has not been asked already
              </Checkbox>
              <Checkbox isChecked isDisabled>
                Keep your question short and to the point
              </Checkbox>
              <Checkbox isChecked isDisabled>
                Double-check grammar and spelling
              </Checkbox>
            </VStack>
          </Box>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" pt={4}>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!content.trim()}
          >
            Add Question
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuestionForm; 