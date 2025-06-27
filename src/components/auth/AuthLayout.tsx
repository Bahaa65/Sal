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
        {/* Left Section - Auth Form */}
        <Box
          bg="#EBFBFF"
          p={8}
          flex="1"
          boxShadow="sm"
        >
          {children}
        </Box>

        {/* Right Section - Illustration */}
        <Box
          flex="1"
          bg="white"
          p={8}
          display={{ base: 'none', md: 'flex' }}
          justifyContent="center"
          alignItems="center"
          borderLeft="1px solid"
          borderColor="gray.200"
          height="100vh"
          width="100%"
        >
          <Box width="500px" height="400px" display="flex" alignItems="center" justifyContent="center">
            <Image
              src="/images/5167170.png"
              alt="People asking questions illustration"
              width="500px"
              height="400px"
              objectFit="contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "https://via.placeholder.com/500x400?text=Auth+Illustration"
              }}
            />
          </Box>
        </Box>
      </HStack>
    </Flex>
  )
}

export default AuthLayout 