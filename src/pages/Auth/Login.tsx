import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink, useToast, Flex, HStack, Divider, Image, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email || !password) {
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
    toast({
      title: 'تسجيل الدخول ناجح',
      description: `مرحباً بك مجدداً يا ${email}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    })
    console.log({ email, password })
  }

  const bgColor = useColorModeValue('brand.50', 'gray.700');

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.100"
      p={4}
      direction={{ base: 'column', md: 'row' }}
    >
      {/* Left Section - Login Form */}
      <Box
        bg={bgColor}
        borderRadius="2xl"
        boxShadow="xl"
        p={8}
        mx={{ base: 0, md: 4 }}
        my={{ base: 4, md: 0 }}
        maxW={{ base: 'md', md: 'xl' }}
        flex="1"
      >
        <VStack spacing={6} align="stretch">
          <Image
            src="/images/logo.png" 
            alt="Sal Logo"
            maxW="150px"
            mb={6}
            mx="auto"
          />

          <HStack justify="center" spacing={0} borderRadius="full" bg="white" p={1}>
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="brand"
              variant="solid"
              borderRadius="full"
              px={6}
              flex="1"
              _hover={{ textDecoration: 'none' }}
            >
              Sign in
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              variant="outline"
              colorScheme="brand"
              borderRadius="full"
              px={6}
              flex="1"
              _hover={{ textDecoration: 'none' }}
            >
              Sign up
            </Button>
          </HStack>

          <form onSubmit={handleSignIn}>
            <VStack spacing={4} mt={6}>
              <FormControl id="email" isRequired>
                <FormLabel srOnly>E-mail</FormLabel>
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="white"
                  borderRadius="md"
                  boxShadow="sm"
                  py={6}
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
                  borderRadius="md"
                  boxShadow="sm"
                  py={6}
                  pl={4}
                />
              </FormControl>

              <Button type="submit" colorScheme="brand" size="lg" width="full" borderRadius="lg" mt={4}>
                Sign in
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
            size="lg"
            width="full"
            borderRadius="lg"
            onClick={() => console.log('Sign in with GitHub')}
          >
            Sign in with GitHub
          </Button>
        </VStack>
      </Box>

      {/* Right Section - Illustration */}
      <Box
        flex="1"
        bg="white"
        borderRadius="2xl"
        boxShadow="xl"
        p={8}
        mx={{ base: 0, md: 4 }}
        my={{ base: 4, md: 0 }}
        maxW={{ base: 'md', md: 'xl' }}
        display={{ base: 'none', md: 'flex' }}
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src="/images/5167170.png" 
          alt="People asking questions illustration"
          maxH="500px"
          objectFit="contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/500x400?text=Login+Illustration";
          }}
        />
      </Box>
    </Flex>
  )
}

export default Login 