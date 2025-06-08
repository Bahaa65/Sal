import { FormControl, FormLabel, Input, HStack, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthForm from '../../components/auth/AuthForm'
import AuthHeader from '../../components/auth/AuthHeader'
import SocialLogin from '../../components/auth/SocialLogin'

const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const toast = useToast()

  const handleRegister = (values: Record<string, string>) => {
    // Retrieve values from the values object passed from AuthForm
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
  }

  const handleGithubLogin = () => {
    console.log('GitHub login clicked')
  }

  return (
    <AuthLayout>
      <AuthHeader activePage="register" />
      <AuthForm
        onSubmit={handleRegister}
        submitButtonText="Sign up"
        formFieldsContent={
          <>
            <HStack spacing={5} width="full">
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
                  name="firstName" // Add name attribute for FormData
                />
              </FormControl>

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
                  name="lastName" // Add name attribute for FormData
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
                name="jobTitle" // Add name attribute for FormData
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
                name="email" // Add name attribute for FormData
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
                name="confirmPassword" // Add name attribute for FormData
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

export default Register