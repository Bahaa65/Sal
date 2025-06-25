import { FormControl, FormLabel, Input, useToast, HStack, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import AuthForm from '../components/auth/AuthForm'
import AuthHeader from '../components/auth/AuthHeader'
import SocialLogin from '../components/auth/SocialLogin'
import { staggerContainer, staggerItem } from '../components/common/animations'

const MotionVStack = motion.create(VStack)

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async () => {
    if (Object.values(formData).some(value => value === '')) {
      toast({
        title: 'Invalid Data',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    if (formData.password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    try {
      setIsSubmitting(true)
      await register(formData)
      
      toast({
        title: 'Registration Successful',
        description: `Welcome, ${formData.first_name}! Your account has been created successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      
      navigate('/home')
    } catch (error: any) {
      console.error('Registration error:', error)
      
      toast({
        title: 'Registration Error',
        description: error.message || 'An error occurred while creating the account',
        status: 'error',
        duration: 4000,
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
      <MotionVStack
        spacing={6}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        width="100%"
      >
        <motion.div variants={staggerItem}>
          <AuthHeader activePage="register" />
        </motion.div>
        
        <AuthForm
          onSubmit={handleRegister}
          submitButtonText={isSubmitting ? "Registering..." : "Register"}
          isSubmitting={isSubmitting}
          formFieldsContent={
            <MotionVStack spacing={4} width="100%" variants={staggerItem}>
              <HStack spacing={4} width="full">
                <FormControl id="last_name" isRequired>
                  <FormLabel srOnly>Last Name</FormLabel>
                  <Input
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="40px"
                    pl={4}
                    width="140px"
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="left"
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
                <FormControl id="first_name" isRequired>
                  <FormLabel srOnly>First Name</FormLabel>
                  <Input
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="40px"
                    pl={4}
                    width="140px"
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="left"
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
              </HStack>

              <FormControl id="username" isRequired>
                <FormLabel srOnly>Username</FormLabel>
                <Input
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
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

              <FormControl id="email" isRequired>
                <FormLabel srOnly>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
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
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
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

              <FormControl id="confirmPassword" isRequired>
                <FormLabel srOnly>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
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

export default RegisterForm 