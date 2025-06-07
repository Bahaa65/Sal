import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink, useToast, Flex, HStack, Divider, Image, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const toast = useToast()

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'الرجاء تعبئة جميع الحقول.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }
    if (password !== confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمتا المرور غير متطابقتين.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }
    toast({
      title: 'تسجيل ناجح',
      description: `مرحباً بك يا ${name}! تم تسجيل حسابك بنجاح.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    })
    console.log({ name, email, password })
  }

  const bgColor = useColorModeValue('#EBFBFF', 'gray.700');

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.100"
      p={4}
      direction={{ base: 'column', md: 'row' }}
    >
      <HStack
        spacing={0}
        borderRadius="2xl"
        boxShadow="xl"
        width="full"
        overflow="hidden"
      >
        {/* Left Section - Illustration */}
        <Box
          flex="1"
          bg="white"
          p={8}
          display={{ base: 'none', md: 'flex' }} // Hide on small screens
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src="/images/5167170.png" // Using the provided image for the illustration
            alt="People asking questions illustration"
            maxH="500px"
            objectFit="contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/500x400?text=Register+Illustration";
            }}
          />
        </Box>

        {/* Right Section - Register Form */}
        <Box
          bg={bgColor}
          p={8}
          flex="1"
        >
          <VStack spacing={6} align="stretch">
            <Image
              src="/images/logo.png" // Path to your Logo image
              alt="Sal Logo"
              maxW="150px" // Adjust size as needed
              mb={6}
              mx="auto"
            />

            <HStack justify="center" spacing={0} borderRadius="full" bg="white" p={1}>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                borderRadius="full"
                h="32px"
                fontSize="sm"
                px={4}
                flex="1"
                color="#0078D4"
                _hover={{ bg: '#0078D4', color: 'white', textDecoration: 'none' }}
              >
                Sign in
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                variant="solid"
                borderRadius="full"
                h="32px"
                fontSize="sm"
                px={4}
                flex="1"
                bg="#0078D4"
                color="white"
                _hover={{ bg: '#006CBE', textDecoration: 'none' }}
              >
                Sign up
              </Button>
            </HStack>

            <form onSubmit={handleSignUp}>
              <VStack spacing={4} mt={6}>
                <HStack spacing={4} width="full">
                  <FormControl id="first-name" isRequired>
                    <FormLabel srOnly>First Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="First name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      bg="white"
                      borderRadius="full"
                      boxShadow="sm"
                      h="58px"
                      pl={4}
                    />
                  </FormControl>

                  <FormControl id="last-name" isRequired>
                    <FormLabel srOnly>Last Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      bg="white"
                      borderRadius="full"
                      boxShadow="sm"
                      h="58px"
                      pl={4}
                    />
                  </FormControl>
                </HStack>

                <FormControl id="job-title" isRequired>
                  <FormLabel srOnly>Job title</FormLabel>
                  <Input
                    type="text"
                    placeholder="Job title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="58px"
                    pl={4}
                  />
                </FormControl>

                <FormControl id="email" isRequired>
                  <FormLabel srOnly>E-mail</FormLabel>
                  <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="58px"
                    pl={4}
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel srOnly>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="58px"
                    pl={4}
                  />
                </FormControl>

                <FormControl id="confirm-password" isRequired>
                  <FormLabel srOnly>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="58px"
                    pl={4}
                  />
                </FormControl>

                <Button 
                  type="submit" 
                  width="full" 
                  borderRadius="lg" 
                  mt={4}
                  h="58px"
                  bg="#0078D4"
                  color="white"
                  _hover={{ bg: '#006CBE' }}
                >
                  Sign up
                </Button>
              </VStack>
            </form>

            <Flex align="center" my={6}>
              <Divider flex="1" borderColor="gray.300" />
              <Text mx={4} color="gray.500">Or</Text>
              <Divider flex="1" borderColor="gray.300" />
            </Flex>

            <Button
              leftIcon={<Box as="span" className="icon-github" fontSize="xl" />} 
              bg="black"
              color="white"
              _hover={{ bg: 'gray.800' }}
              variant="solid"
              width="full"
              borderRadius="lg"
              h="58px"
              onClick={() => console.log('Sign up with GitHub')}
            >
              Sign up with GitHub
            </Button>
          </VStack>
        </Box>
      </HStack>
    </Flex>
  )
}

export default Register