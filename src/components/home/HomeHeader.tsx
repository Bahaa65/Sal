import { Box, Flex, Input, InputGroup, InputLeftElement, Avatar, IconButton, HStack, Spacer, Image, Text } from '@chakra-ui/react';
import { SearchIcon, BellIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { FaHome } from "react-icons/fa";
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HomeHeader = () => {
  const { user } = useAuth();

  return (
    <Flex
      as="header"
      bg="#0078D4"
      color="white"
      p="16px 32px"
      align="center"
      boxShadow="md"
    >
      <HStack spacing="18px" mr={4} minW="224px" maxW="224px" w="224px" justify="flex-start">
        <Box as={RouterLink} to="/profile">
          <Avatar w="40px" h="40px" name={user ? `${user.first_name} ${user.last_name}` : ''} src={user?.avatar} cursor="pointer" />
        </Box>
        <IconButton
          aria-label="Help"
          icon={<QuestionOutlineIcon boxSize="20px" color="white" />}
          isRound={true}
          size="md"
          bg="transparent"
          color="white"
          _hover={{ bg: 'blue.600' }}
        />
        <IconButton
          aria-label="Notifications"
          icon={<BellIcon boxSize="20px" color="white" />}
          isRound={true}
          size="md"
          bg="transparent"
          color="white"
          _hover={{ bg: 'blue.600' }}
        />
        <IconButton
          aria-label="Home"
          icon={<Box as={FaHome} boxSize="20px" color="white" />}
          isRound={true}
          size="md"
          bg="transparent"
          color="white"
          _hover={{ bg: 'blue.600' }}
          as={RouterLink}
          to="/home"
        />
      </HStack>
      <Spacer />
      <InputGroup flex="1" maxWidth="300px" mx="auto">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" boxSize="20px" />}
        />
        <Input
          type="text"
          placeholder="Search"
          bg="white"
          borderRadius="full"
          h="36px"
          color="black"
          textAlign="left"
        />
      </InputGroup>
      <Spacer />
      <HStack spacing="8px" ml={4}>
        <Text fontSize="16px" color="whiteAlpha.800">any question</Text>
        <Image src="/images/logo.png" alt="Sal Logo" maxH="36px" filter="invert(1) brightness(2)" />
      </HStack>
    </Flex>
  );
};

export default HomeHeader; 