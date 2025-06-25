import { Button, HStack, Image, VStack, Box } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

interface AuthHeaderProps {
  activePage: 'login' | 'register'
}

const AuthHeader = ({ activePage }: AuthHeaderProps) => {
  return (
    <VStack spacing={6} align="stretch">
      <Box minH="60px" display="flex" alignItems="center" justifyContent="center">
      <Image
        src="/images/logo.png"
        alt="Sal Logo"
          width="150px"
          height="auto"
        maxW="150px"
        mb={8}
        mx="auto"
      />
      </Box>

      <HStack justify="center" spacing={1} borderRadius="full" bg="white" p={0} maxW="200px" mx="auto" boxShadow="md" mb={8}>
        <Button
          as={RouterLink}
          to="/register"
          variant="solid"
          h="40px"
          fontSize="20px"
          fontWeight="bold"
          px={6}
          flex="1"
          bg={activePage === 'register' ? '#0078D4' : 'white'}
          color={activePage === 'register' ? 'white' : '#0078D4'}
          borderRadius="full"
          _hover={{ bg: activePage === 'register' ? '#006CBE' : 'gray.50', textDecoration: 'none' }}
        >
          Sign up
        </Button>
        <Button
          as={RouterLink}
          to="/login"
          variant="ghost"
          h="40px"
          fontSize="20px"
          fontWeight="bold"
          px={6}
          flex="1"
          bg={activePage === 'login' ? '#0078D4' : 'white'}
          color={activePage === 'login' ? 'white' : '#0078D4'}
          borderRadius="full"
          _hover={{ bg: activePage === 'login' ? '#006CBE' : 'gray.50', textDecoration: 'none' }}
        >
          Sign in
        </Button>
      </HStack>
    </VStack>
  )
}

export default AuthHeader 