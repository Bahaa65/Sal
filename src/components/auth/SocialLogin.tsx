import { Button, Divider, Flex, Icon, Text } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

interface SocialLoginProps {
  onGithubClick: () => void
}

const SocialLogin = ({ onGithubClick }: SocialLoginProps) => {
  return (
    <>
      <Flex align="center" my={1} maxW="300px" mx="auto" width="full">
        <Divider flex="1" borderColor="gray.300" />
        <Text mx={1} color="gray.500" fontSize="14px">Or</Text>
        <Divider flex="1" borderColor="gray.300" />
      </Flex>

      <Button
        leftIcon={<Icon as={FaGithub} boxSize={5} />}
        bg="black"
        color="white"
        _hover={{ bg: 'white', color: 'black', border: '1px solid', borderColor: 'black' }}
        variant="solid"
        maxW="200px"
        mx="auto"
        width="full"
        borderRadius="full"
        h="45px"
        onClick={onGithubClick}
      >
        Sign in with GitHub
      </Button>
    </>
  )
}

export default SocialLogin 