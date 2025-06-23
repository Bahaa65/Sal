import { FormControl, FormLabel, Input, useToast, HStack, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthForm from '../../components/auth/AuthForm'
import AuthHeader from '../../components/auth/AuthHeader'
import SocialLogin from '../../components/auth/SocialLogin'
import { staggerContainer, staggerItem } from '../../components/common/animations'

const MotionVStack = motion.create(VStack)

const Register = () => {
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
        title: 'خطأ في البيانات',
        description: 'يرجى تعبئة جميع الحقول المطلوبة',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    if (formData.password !== confirmPassword) {
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

    try {
      setIsSubmitting(true)
      await register(formData)
      
      toast({
        title: 'تسجيل ناجح',
        description: `مرحباً بك يا ${formData.first_name}! تم تسجيل حسابك بنجاح.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      
      navigate('/home')
    } catch (error: any) {
      console.error('Registration error:', error)
      
      toast({
        title: 'خطأ في التسجيل',
        description: error.message || 'حدث خطأ أثناء إنشاء الحساب',
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
          <AuthHeader activePage="register" />
        </motion.div>
        
        <AuthForm
          onSubmit={handleRegister}
          submitButtonText={isSubmitting ? "جاري التسجيل..." : "إنشاء حساب"}
          isSubmitting={isSubmitting}
          formFieldsContent={
            <MotionVStack spacing={4} width="100%" variants={staggerItem}>
              <HStack spacing={4} width="full">
                <FormControl id="last_name" isRequired>
                  <FormLabel srOnly>الاسم الأخير</FormLabel>
                  <Input
                    name="last_name"
                    placeholder="الاسم الأخير"
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
                  <FormLabel srOnly>الاسم الأول</FormLabel>
                  <Input
                    name="first_name"
                    placeholder="الاسم الأول"
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
                <FormLabel srOnly>اسم المستخدم</FormLabel>
                <Input
                  name="username"
                  placeholder="اسم المستخدم"
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
                <FormLabel srOnly>البريد الإلكتروني</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
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
                <FormLabel srOnly>كلمة المرور</FormLabel>
                <Input
                  type="password"
                  name="password"
                  placeholder="كلمة المرور"
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
                <FormLabel srOnly>تأكيد كلمة المرور</FormLabel>
                <Input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
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

export default Register