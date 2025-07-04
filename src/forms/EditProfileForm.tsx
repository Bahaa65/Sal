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
import { useUploadAvatar } from '../hooks/useUploadAvatar';
import { useRemoveAvatar } from '../hooks/useRemoveAvatar';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { CloseIcon } from "@chakra-ui/icons";

interface EditProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdated: (newUser: any) => void;
}

const EditProfileForm = ({ isOpen, onClose, user, onProfileUpdated }: EditProfileFormProps) => {
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [job, setJob] = useState(user?.job || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const updateProfile = useUpdateProfile();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadAvatar.mutate(file, {
        onSuccess: (path: string) => {
          setAvatar(path);
          toast({ title: 'Profile picture updated.', status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
        },
        onError: () => {
          toast({ title: 'Failed to upload image.', status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
        },
      });
    }
  };

  const handleRemoveAvatar = () => {
    removeAvatar.mutate(undefined, {
      onSuccess: () => {
        setAvatar('');
        toast({ title: 'Profile picture removed.', status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
      },
      onError: () => {
        toast({ title: 'Failed to remove image.', status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload: any = {};
    if (firstName) payload.first_name = firstName;
    if (lastName) payload.last_name = lastName;
    if (job) payload.job = job;
    if (bio) payload.bio = bio;
    if (avatar) {
      try {
        const url = new URL(avatar);
        const parts = url.pathname.split('/');
        payload.avatar = parts[parts.length - 1];
      } catch {
        payload.avatar = avatar;
      }
    } else {
      payload.avatar = '';
    }
    updateProfile.mutate(payload, {
      onSuccess: (data) => {
        toast({ title: 'Profile updated successfully.', status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
        onProfileUpdated(data);
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: 'Failed to update profile.',
          description: error.response?.data?.detail || 'Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
      },
      onSettled: () => {
        setIsSaving(false);
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Flex align="center" direction="column" position="relative">
              <Box position="relative" mb={2}>
                <Avatar size="xl" src={avatar} name={firstName + ' ' + lastName} />
                {avatar && (
                  <Button
                    size="xs"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorScheme="red"
                    borderRadius="full"
                    onClick={handleRemoveAvatar}
                    zIndex={2}
                    p={0}
                    minW="24px"
                    h="24px"
                  >
                    <CloseIcon boxSize={3} />
                  </Button>
                )}
              </Box>
              <Button as="label" htmlFor="avatar-upload" variant="outline" size="sm" isLoading={isSaving || uploadAvatar.isPending}>
                Change Photo
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                  disabled={isSaving || uploadAvatar.isPending}
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
          <Button variant="ghost" mr={3} onClick={onClose} disabled={isSaving || updateProfile.isPending}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave} isLoading={isSaving || updateProfile.isPending}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileForm; 