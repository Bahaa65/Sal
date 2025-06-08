import { FormControl, FormLabel, Input, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthForm from '../../components/auth/AuthForm'
import AuthHeader from '../../components/auth/AuthHeader'
import SocialLogin from '../../components/auth/SocialLogin'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  const handleLogin = (values: Record<string, string>) => {
    // Retrieve values from the values object passed from AuthForm
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
  }

  const handleGithubLogin = () => {
    console.log('GitHub login clicked')
  }

  return (
    <AuthLayout>
      <AuthHeader activePage="login" />
      <AuthForm
        onSubmit={handleLogin}
        submitButtonText="Sign in"
        formFieldsContent={
          <>
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
                name="password" // Add name attribute for FormData
              />
            </FormControl>
          </>
        }
      >
        <SocialLogin onGithubClick={handleGithubLogin} />
      </AuthForm>
    </AuthLayout>
  )
}

export default Login 