import { Box, Container } from '@chakra-ui/react';
import { NotificationsList } from '../../components/PageTransition';
import MainLayout from '../../components/home/MainLayout';

const NotificationsPage = () => {
  return (
    <MainLayout>
      <Container maxW="lg" py={8}>
        <Box boxShadow="md" borderRadius="lg" bg="white" p={6}>
          <NotificationsList />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default NotificationsPage; 