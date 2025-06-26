import React from 'react';
import { Box, Skeleton, Stack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { pageTransition } from './common/animations'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { List, ListItem, Button, Badge, Flex, Text, Avatar, HStack, VStack } from '@chakra-ui/react';
import { useInfiniteNotificationsQuery } from '../hooks/useInfiniteNotificationsQuery';
import { useInView } from 'react-intersection-observer';
import { markNotificationAsRead } from '../services/notifications';
import { Notification } from '../types/Notification';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box)

interface PageTransitionProps {
  children: ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <MotionBox
      {...pageTransition}
      width="100%"
    >
      {children}
    </MotionBox>
  )
}

export default PageTransition

export const NotificationsList = () => {
  const { ref, inView } = useInView({ triggerOnce: false });
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotificationsQuery();
  const notifications = data ? data.pages.flatMap(page => page.data) : [];
  const queryClient = useQueryClient();
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['notifications-infinite'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((notif: any) =>
              notif.id === id ? { ...notif, is_read: true } : notif
            ),
          })),
        };
      });
    },
  });

  // Fetch next page when inView changes to true
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle notification click and navigation
  const handleNotificationClick = (notif: Notification) => {
    // Mark as read first
    if (!notif.is_read) {
      markAsReadMutation.mutate(notif.id);
    }
    // Navigate only if question_id exists
    if (notif.question_id) {
      navigate(`/questions/${notif.question_id}`);
    }
    // else do nothing
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_answer':
        return '💬';
      case 'new_question':
        return '❓';
      case 'vote':
        return '👍';
      case 'accepted_answer':
        return '✅';
      case 'mention':
        return '👤';
      default:
        return '🔔';
    }
  };

  // Detailed English notification message based on type
  const getNotificationDetails = (notif: Notification) => {
    switch (notif.type) {
      case 'new_answer':
        return notif.message || 'A new answer was added to your question.';
      case 'new_question':
        return notif.message || 'A new question was posted.';
      case 'vote':
        return notif.message || 'Your question or answer received a new vote.';
      case 'accepted_answer':
        return notif.message || 'Your answer was accepted as the best answer.';
      case 'mention':
        return notif.message || 'You were mentioned in a comment or answer.';
      // Add more types as needed
      default:
        return notif.message || 'You have a new notification.';
    }
  };

  // English readable type label
  const getTypeLabel = (notif: Notification) => {
    switch (notif.type) {
      case 'new_answer':
        return 'New Answer';
      case 'new_question':
        return 'New Question';
      case 'vote':
        return 'Vote';
      case 'accepted_answer':
        return 'Accepted Answer';
      case 'mention':
        return 'Mention';
      default:
        return 'Notification';
    }
  };

  if (isLoading) return (
    <Stack spacing={4} py={6}>
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} height="80px" borderRadius="md" />
      ))}
    </Stack>
  );

  return (
    <Box>
      <Flex align="center" mb={4}>
        <Text fontWeight="bold" fontSize="xl">Notifications</Text>
        <Badge colorScheme="red" ml={2}>{notifications.filter((n: Notification) => !n.is_read).length ?? 0} unread</Badge>
      </Flex>
      <List spacing={3}>
        {notifications.map((notif: Notification) => (
          <ListItem
            key={notif.id}
            bg={notif.is_read ? 'white' : 'blue.50'}
            borderRadius="md"
            p={4}
            boxShadow="sm"
            cursor="pointer"
            _hover={{ 
              bg: notif.is_read ? 'gray.50' : 'blue.100',
              transform: 'translateY(-1px)',
              boxShadow: 'md'
            }}
            transition="all 0.2s"
            onClick={() => handleNotificationClick(notif)}
            borderLeft={!notif.is_read ? '4px solid' : 'none'}
            borderLeftColor={!notif.is_read ? 'blue.500' : 'transparent'}
          >
            <HStack spacing={3} align="start">
              <Box fontSize="xl" color="blue.500">
                {getNotificationIcon(notif.type)}
              </Box>
              <VStack align="start" spacing={1} flex={1}>
                <Text fontWeight="medium" fontSize="sm" color="gray.800">
                  {getNotificationDetails(notif)}
                </Text>
                <HStack spacing={2}>
                  <Badge size="sm" colorScheme="blue" variant="subtle">
                    {getTypeLabel(notif)}
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(notif.created_at).toLocaleString()}
                  </Text>
                </HStack>
              </VStack>
              {!notif.is_read && (
                <Box
                  w={2}
                  h={2}
                  bg="blue.500"
                  borderRadius="full"
                  flexShrink={0}
                />
              )}
            </HStack>
          </ListItem>
        ))}
        {/* Infinite scroll observer for notifications */}
        {hasNextPage && <div ref={ref} style={{ height: 1 }} />}
      </List>
      {/* Fallback Load More button for notifications */}
      {hasNextPage && !inView && (
        <Flex justify="center" mt={4}>
          <Button onClick={() => fetchNextPage()} isLoading={isFetchingNextPage}>
            Load More Notifications
          </Button>
        </Flex>
      )}
    </Box>
  );
}; 