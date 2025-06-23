import { Button, VStack, useToast } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface AuthFormProps {
  onSubmit: (values: Record<string, string>) => void
  submitButtonText: string
  formFieldsContent: ReactNode
  children?: ReactNode
  isSubmitting?: boolean
}

const AuthForm = ({ onSubmit, submitButtonText, formFieldsContent, children, isSubmitting = false }: AuthFormProps) => {
  const toast = useToast()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // منع الإرسال إذا كان في حالة تحميل
    if (isSubmitting) {
      return
    }
    
    const formData = new FormData(event.currentTarget)
    const values: Record<string, string> = {}
    
    formData.forEach((value, key) => {
      values[key] = value as string
    })

    const inputs = event.currentTarget.querySelectorAll('input[required]')
    let allFieldsFilled = true
    inputs.forEach(input => {
      const htmlInput = input as HTMLInputElement
      if (!htmlInput.value.trim()) {
        allFieldsFilled = false
      }
    })

    if (!allFieldsFilled) {
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

    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={2} maxW="300px" mx="auto" width="full">
        {formFieldsContent}

        <Button 
          type="submit" 
          width="120px" 
          borderRadius="full" 
          h="45px"
          bg="#0078D4"
          color="white"
          _hover={{ bg: '#006CBE' }}
          isLoading={isSubmitting}
          loadingText="جاري..."
          isDisabled={isSubmitting}
        >
          {submitButtonText}
        </Button>

        {children}
      </VStack>
    </form>
  )
}

export default AuthForm 