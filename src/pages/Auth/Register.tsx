import { FormControl, FormLabel, Input, useToast, HStack, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthForm from '../../components/auth/AuthForm'
import AuthHeader from '../../components/auth/AuthHeader'
import SocialLogin from '../../components/auth/SocialLogin'
import { staggerContainer, staggerItem } from '../../components/common/animations'

const MotionVStack = motion.create(VStack)

const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  const handleRegister = (values: Record<string, string>) => {
    const currentFirstName = values.firstName || firstName;
    const currentLastName = values.lastName || lastName;
    const currentJobTitle = values.jobTitle || jobTitle;
    const currentEmail = values.email || email;
    const currentPassword = values.password || password;
    const currentConfirmPassword = values.confirmPassword || confirmPassword;

    if (currentPassword !== currentConfirmPassword) {
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

    console.log('Register values:', { firstName: currentFirstName, lastName: currentLastName, jobTitle: currentJobTitle, email: currentEmail, password: currentPassword, confirmPassword: currentConfirmPassword })
    toast({
      title: 'تسجيل ناجح',
      description: `مرحباً بك يا ${currentFirstName}! تم تسجيل حسابك بنجاح.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    })
    navigate('/home')
  }

  const handleGithubLogin = () => {
    console.log('GitHub login clicked')
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
          submitButtonText="Sign up"
          formFieldsContent={
            <MotionVStack spacing={4} width="100%" variants={staggerItem}>
              <HStack spacing={5} width="full">
                <FormControl id="lastName" isRequired>
                  <FormLabel srOnly>Last Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="40px"
                    pl={4}
                    width="140px"
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="left"
                    name="lastName"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                    }}
                    _hover={{
                      borderColor: 'blue.300',
                    }}
                  />
                </FormControl>

                <FormControl id="firstName" isRequired>
                  <FormLabel srOnly>First Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    bg="white"
                    borderRadius="full"
                    boxShadow="sm"
                    h="40px"
                    pl={4}
                    width="140px"
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="left"
                    name="firstName"
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

              <FormControl id="jobTitle" isRequired>
                <FormLabel srOnly>Job title</FormLabel>
                <Input
                  type="text"
                  placeholder="Job title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
                  name="jobTitle"
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
                <FormLabel srOnly>E-mail</FormLabel>
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
                  name="email"
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
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  h="40px"
                  pl={4}
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="left"
                  name="password"
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
                  name="confirmPassword"
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

export default Register