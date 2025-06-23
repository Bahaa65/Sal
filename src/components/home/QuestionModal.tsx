import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Textarea, Flex, Avatar, Text, VStack, Link, Checkbox, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

type QuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string) => void;
  isSubmitting?: boolean;
};

const QuestionModal = ({ isOpen, onClose, onSubmit, isSubmitting }: QuestionModalProps) => {
  const [questionText, setQuestionText] = useState('');
  const { user } = useAuth();

  const handleSubmit = () => {
    if (questionText.trim()) {
      onSubmit(questionText);
      setQuestionText('');
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="lg" p={4}>
        <ModalHeader borderBottomWidth="1px" pb={3} mb={3}>
          <Flex align="center">
            <Avatar name={`${user.first_name} ${user.last_name}`} src={user.avatar} mr={3} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium" fontSize="lg" color="black">{`${user.first_name} ${user.last_name}`}</Text>
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="lg" color="gray.600" mb={4}>What is your Question ?</Text>
          <Textarea
            placeholder="Write your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            minH="120px"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
          />

          <Box mt={6} p={4} bg="gray.50" borderRadius="md">
            <Flex align="center" mb={2}>
              <QuestionOutlineIcon mr={2} color="blue.500" />
              <Text fontWeight="bold" color="blue.600">Tips on getting good answers quickly</Text>
            </Flex>
            <VStack align="start" spacing={2} fontSize="sm" color="gray.700">
              <Checkbox isChecked isDisabled>Make sure your question has not been asked already</Checkbox>
              <Checkbox isChecked isDisabled>Keep your question short and to the point</Checkbox>
              <Checkbox isChecked isDisabled>Double-check grammar and spelling</Checkbox>
            </VStack>
          </Box>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" pt={3} mt={3}>
          <Flex justify="flex-end" width="full">
            <Button variant="ghost" onClick={onClose} mr={3}>Cancel</Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={!questionText.trim() || isSubmitting}
              isLoading={isSubmitting}
            >
              Add Question
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuestionModal; 