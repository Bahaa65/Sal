import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Avatar,
  VStack,
  useToast,
  Flex,
  Box,
  FormLabel,
} from "@chakra-ui/react";
import apiClient from "../../services/apiClient";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdated: (newUser: any) => void;
}

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdated }: EditProfileModalProps) => {
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [job, setJob] = useState(user?.job || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // رفع الصورة مباشرة
      const formData = new FormData();
      formData.append("file", file);
      try {
        setIsSaving(true);
        const { data } = await apiClient.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAvatar(data.path.startsWith('http') ? data.path : `${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}/uploads/${data.path}`);
        toast({ title: "Profile picture updated.", status: "success" });
      } catch (error) {
        toast({ title: "Failed to upload image.", status: "error" });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: any = {};
      if (firstName) payload.first_name = firstName;
      if (lastName) payload.last_name = lastName;
      if (job) payload.job = job;
      if (bio) payload.bio = bio;
      if (avatar) {
        // إذا كان avatar رابط كامل، أرسل فقط اسم الملف
        try {
          const url = new URL(avatar);
          const parts = url.pathname.split('/');
          payload.avatar = parts[parts.length - 1];
        } catch {
          payload.avatar = avatar;
        }
      }
      const { data } = await apiClient.patch("/profile", payload);
      toast({ title: "Profile updated successfully.", status: "success" });
      onProfileUpdated(data.data);
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to update profile.",
        description: error.response?.data?.detail || "Please try again.",
        status: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Flex align="center" direction="column">
              <Avatar size="xl" src={avatar} mb={2} />
              <Button as="label" htmlFor="avatar-upload" variant="outline" size="sm" isLoading={isSaving}>
                Change Photo
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                  disabled={isSaving}
                />
              </Button>
            </Flex>
            <Box>
              <FormLabel>First Name</FormLabel>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
            </Box>
            <Box>
              <FormLabel>Last Name</FormLabel>
              <Input value={lastName} onChange={e => setLastName(e.target.value)} />
            </Box>
            <Box>
              <FormLabel>Job Title</FormLabel>
              <Input value={job} onChange={e => setJob(e.target.value)} />
            </Box>
            <Box>
              <FormLabel>Bio</FormLabel>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} />
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave} isLoading={isSaving}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal; 