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
import { useState, useRef } from "react";
import { MdPhoto } from "react-icons/md";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
}

const AnswerModal = ({ isOpen, onClose, questionId }: AnswerModalProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const { data } = await apiClient.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const url = data.path.startsWith("http")
            ? data.path
            : `${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}/uploads/${data.path}`;
          uploaded.push(url);
        } catch (error) {
          toast({ title: `فشل رفع صورة: ${file.name}`, status: "error" });
        }
      }
      setImages((prev) => [...prev, ...uploaded]);
      setIsUploading(false);
      if (uploaded.length > 0) toast({ title: "تم رفع الصور بنجاح.", status: "success" });
    }
  };

  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const mutation = useMutation({
    mutationFn: (newAnswer: { content: string; images?: string[] }) =>
      apiClient.post(`/answers`, { content: newAnswer.content, question_id: questionId, images: newAnswer.images }),
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
      setImages([]);
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
    mutation.mutate({ content, images: images.length > 0 ? images : undefined });
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
          {images.length > 0 && (
            <Flex mt={3} mb={2} gap={3} wrap="wrap">
              {images.map((img) => (
                <Box key={img} position="relative" display="inline-block">
                  <img src={img} alt="answer-img" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }} />
                  <Button
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top={1}
                    right={1}
                    borderRadius="full"
                    p={0}
                    minW={6}
                    h={6}
                    onClick={() => handleRemoveImage(img)}
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Flex>
          )}
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
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isUploading}
            />
            <Button
              leftIcon={<Icon as={MdPhoto} />} 
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
              isDisabled={isUploading}
            >
              Add Photo
            </Button>
          </>
          <Flex>
            <Button variant="ghost" mr={3} onClick={onClose} disabled={isUploading || mutation.isPending}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={mutation.isPending}
              isDisabled={isUploading}
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