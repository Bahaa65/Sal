import { FormControl, FormLabel, Input, useToast, VStack, InputGroup, InputRightElement, IconButton, Spinner, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import AuthForm from '../components/auth/AuthForm'
import AuthHeader from '../components/auth/AuthHeader'
import SocialLogin from '../components/auth/SocialLogin'
import { staggerContainer, staggerItem } from '../components/common/animations'

const MotionVStack = motion.create(VStack)

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (values: Record<string, string>) => {
    const currentUsername = values.username || username;
    const currentPassword = values.password || password;

    if (!currentUsername || !currentPassword) {
      toast({
        title: 'Invalid Data',
        description: 'Please enter your username and password',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      return;
    }

    try {
      setIsSubmitting(true)
      await login(currentUsername, currentPassword)
      
      toast({
        title: 'Login Successful',
        description: 'You have logged in successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })

      // Redirect to the requested page or home
      const from = location.state?.from?.pathname || '/home'
      navigate(from, { replace: true })
    } catch (error: any) {
      console.error('Login error:', error)
      
      toast({
        title: 'Login Error',
        description: error.message || 'An error occurred during login',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGithubLogin = () => {
    console.log('GitHub login clicked')
    toast({
      title: 'Coming Soon',
      description: 'GitHub login will be added soon',
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    })
  }

  return (
    <AuthLayout>
      {isSubmitting && (
        <Flex position="fixed" top={0} left={0} w="100vw" h="100vh" bg="rgba(255,255,255,0.8)" zIndex={9999} align="center" justify="center" direction="column">
          <Spinner size="xl" color="blue.500" mb={4} />
          <span style={{ fontSize: '1.2rem', color: '#0078D4', fontWeight: 'bold' }}>Logging in...</span>
        </Flex>
      )}
      <MotionVStack
        spacing={6}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        width="100%"
      >
        <motion.div variants={staggerItem}>
          <AuthHeader activePage="login" />
        </motion.div>
        
        <AuthForm
          onSubmit={handleLogin}
          submitButtonText={isSubmitting ? "Logging in..." : "Login"}
          isSubmitting={isSubmitting}
          formFieldsContent={
            <MotionVStack spacing={4} width="100%" variants={staggerItem}>
              <FormControl id="username" isRequired>
                <FormLabel srOnly>Username</FormLabel>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
                  name="username"
                  isDisabled={isSubmitting}
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                  }}
                  _hover={{
                    borderColor: 'blue.300',
                  }}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel srOnly>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="40px"
                    pl={4}
                    pr={12}
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="left"
                    name="password"
                    isDisabled={isSubmitting}
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                    }}
                    _hover={{
                      borderColor: 'blue.300',
                    }}
                  />
                  <InputRightElement h="40px" pr={2}>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      size="sm"
                      onClick={handleTogglePassword}
                      color="gray.500"
                      _hover={{ color: "gray.700" }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </MotionVStack>
          }
        >
          <motion.div variants={staggerItem}>
            <SocialLogin onGithubClick={handleGithubLogin} />
          </motion.div>
        </AuthForm>
      </MotionVStack>
    </AuthLayout>
  )
}

export default LoginForm 