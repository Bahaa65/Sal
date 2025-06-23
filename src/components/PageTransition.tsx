import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { pageTransition } from './common/animations'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationAsRead } from '../services/notifications';
import { List, ListItem, Button, Badge, Spinner, Flex, Text } from '@chakra-ui/react';

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
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const mutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  if (isLoading) return <Spinner />;

  return (
    <Box>
      <Flex align="center" mb={4}>
        <Text fontWeight="bold" fontSize="xl">الإشعارات</Text>
        <Badge colorScheme="red" ml={2}>{data.unread_count} غير مقروءة</Badge>
      </Flex>
      <List spacing={3}>
        {data.data.map((notif: any) => (
          <ListItem
            key={notif.id}
            bg={notif.read ? 'white' : 'blue.50'}
            borderRadius="md"
            p={3}
            boxShadow="sm"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Text>{notif.content || notif.text || 'إشعار جديد'}</Text>
              <Text fontSize="xs" color="gray.500">{new Date(notif.created_at).toLocaleString()}</Text>
            </Box>
            {!notif.read && (
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => mutation.mutate(notif.id)}
              >
                تعيين كمقروء
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 