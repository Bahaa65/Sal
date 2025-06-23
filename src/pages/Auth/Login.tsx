import { FormControl, FormLabel, Input, useToast, VStack, Button, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthForm from '../../components/auth/AuthForm'
import AuthHeader from '../../components/auth/AuthHeader'
import SocialLogin from '../../components/auth/SocialLogin'
import { staggerContainer, staggerItem } from '../../components/common/animations'

const MotionVStack = motion.create(VStack)

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleLogin = async (values: Record<string, string>) => {
    const currentUsername = values.username || username;
    const currentPassword = values.password || password;

    if (!currentUsername || !currentPassword) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى إدخال اسم المستخدم وكلمة المرور',
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
        title: 'تسجيل دخول ناجح',
        description: 'تم تسجيل دخولك بنجاح.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })

      // التوجيه إلى الصفحة المطلوبة أو الصفحة الرئيسية
      const from = location.state?.from?.pathname || '/home'
      navigate(from, { replace: true })
    } catch (error: any) {
      console.error('Login error:', error)
      
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'حدث خطأ أثناء تسجيل الدخول',
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
      title: 'قريباً',
      description: 'سيتم إضافة تسجيل الدخول بـ GitHub قريباً',
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
          <AuthHeader activePage="login" />
        </motion.div>
        
        <AuthForm
          onSubmit={handleLogin}
          submitButtonText={isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          isSubmitting={isSubmitting}
          formFieldsContent={
            <MotionVStack spacing={4} width="100%" variants={staggerItem}>
              <FormControl id="username" isRequired>
                <FormLabel srOnly>اسم المستخدم</FormLabel>
                <Input
                  type="text"
                  placeholder="اسم المستخدم"
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
                <FormLabel srOnly>كلمة المرور</FormLabel>
                <Input
                  type="password"
                  placeholder="كلمة المرور"
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

export default Login 