import { Box, Flex, Input, InputGroup, InputLeftElement, Avatar, IconButton, HStack, Spacer, Image, Text } from '@chakra-ui/react';
import { SearchIcon, BellIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { FaHome } from "react-icons/fa";
import { Link as RouterLink } from 'react-router-dom';

const HomeHeader = () => {
  return (
    <Flex
      as="header"
      bg="#0078D4"
      color="white"
      p="16px 32px"
      align="center"
      boxShadow="md"
    >
      <HStack spacing="8px">
      <Text fontSize="16px" color="whiteAlpha.800">any question</Text>
        <Image src="/images/logo.png" alt="Sal Logo" maxH="36px" filter="invert(1) brightness(2)" />
        
      </HStack>

      <Spacer />

      <InputGroup flex="1" maxWidth="300px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" boxSize="20px" />}
        />
        <Input type="text" placeholder="Search" bg="white" borderRadius="full" h="36px" color="black" />
      </InputGroup>

      <Spacer />

      <HStack spacing="12px">
        <IconButton
          aria-label="Home"
          icon={<Box as={FaHome} boxSize="20px" />}
          isRound={true}
          size="md"
          bg="transparent"
          _hover={{ bg: 'blue.600' }}
          as={RouterLink}
          to="/home"
        />
        <IconButton
          aria-label="Notifications"
          icon={<BellIcon boxSize="20px" />}
          isRound={true}
          size="md"
          bg="transparent"
          _hover={{ bg: 'blue.600' }}
        />
        <IconButton
          aria-label="Help"
          icon={<QuestionOutlineIcon boxSize="20px" />}
          isRound={true}
          size="md"
          bg="transparent"
          _hover={{ bg: 'blue.600' }}
        />
        <Avatar w="40px" h="40px" name="Medhat Mohamed" src="/images/medhat.png" />
      </HStack>
    </Flex>
  );
};

export default HomeHeader; 