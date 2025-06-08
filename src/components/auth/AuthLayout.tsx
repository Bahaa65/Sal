import { Box, Flex, HStack, Image } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="white"
      p={4}
      direction={{ base: 'column', md: 'row' }}
    >
      <HStack
        spacing={0}
        borderRadius="2xl"
        boxShadow="2xl"
        width="full"
        overflow="hidden"
        bg="#EBFBFF"
        border="1px solid"
        borderColor="gray.200"
      >
        {/* Right Section - Illustration */}
        <Box
          flex="1"
          bg="white"
          p={8}
          display={{ base: 'none', md: 'flex' }}
          justifyContent="center"
          alignItems="center"
          borderRight="1px solid"
          borderColor="gray.200"
        >
          <Image
            src="/images/5167170.png"
            alt="People asking questions illustration"
            maxH="full"
            objectFit="contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "https://via.placeholder.com/500x400?text=Auth+Illustration"
            }}
          />
        </Box>

        {/* Left Section - Auth Form */}
        <Box
          bg="#EBFBFF"
          p={8}
          flex="1"
          boxShadow="sm"
        >
          {children}
        </Box>
      </HStack>
    </Flex>
  )
}

export default AuthLayout 