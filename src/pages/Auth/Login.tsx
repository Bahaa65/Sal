import { FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthForm from '../../components/auth/AuthForm'
import AuthHeader from '../../components/auth/AuthHeader'
import SocialLogin from '../../components/auth/SocialLogin'
import { staggerContainer, staggerItem } from '../../components/common/animations'

const MotionVStack = motion.create(VStack)

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogin = (values: Record<string, string>) => {
    const currentEmail = values.email || email;
    const currentPassword = values.password || password;

    console.log('Login values:', { email: currentEmail, password: currentPassword })
    toast({
      title: 'تسجيل دخول ناجح',
      description: 'تم تسجيل دخولك بنجاح.',
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
          <AuthHeader activePage="login" />
        </motion.div>
        
        <AuthForm
          onSubmit={handleLogin}
          submitButtonText="Sign in"
          formFieldsContent={
            <MotionVStack spacing={4} width="100%" variants={staggerItem}>
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

export default Login 