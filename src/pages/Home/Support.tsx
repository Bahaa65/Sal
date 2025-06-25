import { Box, Heading, Text, Link, Flex, Icon } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { FaGithub } from 'react-icons/fa';
import MainLayout from '../../components/home/MainLayout';

const SUPPORT_EMAIL = 'bahaa.mohamed@robustastudio.com'; 
const GITHUB_URL = 'https://github.com/Bahaa65/Sal'; 

const Support = () => {
  return (
    <MainLayout>
      <Flex minH="80vh" align="center" justify="center" bg="gray.50">
        <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" maxW="400px" w="100%">
          <Heading as="h2" size="lg" mb={4} color="blue.600">Technical Support</Heading>
          <Text fontSize="md" mb={4} color="gray.700">
            If you encounter any issues or have questions, you can contact us via email or visit our GitHub page.
          </Text>
          <Flex align="center" mb={3}>
            <Icon as={EmailIcon} color="blue.500" boxSize={5} mr={2} />
            <Text as="span" fontWeight="bold" color="gray.800">Email:</Text>
            <Link href={`mailto:${SUPPORT_EMAIL}`} ml={2} color="blue.600">{SUPPORT_EMAIL}</Link>
          </Flex>
          <Flex align="center">
            <Icon as={FaGithub} color="gray.800" boxSize={5} mr={2} />
            <Text as="span" fontWeight="bold" color="gray.800">GitHub:</Text>
            <Link href={GITHUB_URL} ml={2} color="blue.600" isExternal>
              {GITHUB_URL}
            </Link>
          </Flex>
        </Box>
      </Flex>
    </MainLayout>
  );
};

export default Support; 