import React from 'react';
import { Box, Skeleton, Stack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { pageTransition } from './common/animations'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { List, ListItem, Button, Badge, Flex, Text } from '@chakra-ui/react';
import { useInfiniteNotificationsQuery } from '../hooks/useInfiniteNotificationsQuery';
import { useInView } from 'react-intersection-observer';
import { markNotificationAsRead } from '../services/notifications';
import { Notification } from '../types/Notification';

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
        <Skeleton key={i} height="48px" borderRadius="md" />
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
            p={3}
            boxShadow="sm"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Text fontWeight="medium">{getNotificationDetails(notif)}</Text>
              <Text fontSize="xs" color="gray.500">{getTypeLabel(notif)}</Text>
              <Text fontSize="xs" color="gray.500">{new Date(notif.created_at).toLocaleString()}</Text>
            </Box>
            {!notif.is_read && (
              <Button
                size="sm"
                colorScheme="blue"
                isLoading={markAsReadMutation.isPending && markAsReadMutation.variables === notif.id}
                onClick={() => markAsReadMutation.mutate(notif.id)}
              >
                Mark as read
              </Button>
            )}
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