import { Box, Flex, Avatar, IconButton, HStack, Spacer, Text } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaCommentDots, FaEllipsisV } from "react-icons/fa";

const QuestionCard = () => {
  return (
    <Box mt="16px" p="16px" bg="white" borderRadius="lg" boxShadow="md" maxW="600px" mx="auto" mb="16px">
      <HStack>
          <Avatar w="40px" h="40px" name="Medhat Mohamed" src="/images/medhat.png" />
          <Box>
              <Text fontSize="16px" fontWeight="bold">Medhat Mohamed</Text>
              <Text fontSize="12px" color="gray.500" fontWeight="light">Software Developer</Text>
          </Box>
          <Spacer />
          <IconButton
              aria-label="Options"
              icon={<Box as={FaEllipsisV} boxSize="20px" />}
              variant="ghost"
              isRound={true}
          />
      </HStack>
      <Text fontSize="16px" mt="12px">What Android version is now available in your phone?</Text>

      <HStack mt="12px" spacing="16px">
          <HStack spacing="4px">
              <IconButton aria-label="Upvote" icon={<ChevronUpIcon boxSize="20px" />} size="sm" variant="ghost" />
              <Text fontSize="12px" fontWeight="light">10</Text>
          </HStack>
          <HStack spacing="4px">
              <IconButton aria-label="Downvote" icon={<ChevronDownIcon boxSize="20px" />} size="sm" variant="ghost" />
              <Text fontSize="12px" fontWeight="light">1</Text>
          </HStack>
          <HStack spacing="4px">
              <IconButton aria-label="Comments" icon={<Box as={FaCommentDots} boxSize="20px" />} size="sm" variant="ghost" />
              <Text fontSize="12px" fontWeight="light">2</Text>
          </HStack>
          <Spacer />
          <Text fontSize="12px" color="gray.500" fontWeight="light">1 h ago</Text>
      </HStack>

      {/* Answer box */}
      <Box mt="12px" p="12px" bg="#f9f9f9" borderRadius="md">
          <HStack>
              <Avatar size="xs" name="Rose Ben" src="/images/rose.png" />
              <Box>
                  <Text fontSize="14px" fontWeight="bold">Rose Ben</Text>
                  <Text fontSize="12px" color="gray.500" fontWeight="light">Software Developer</Text>
              </Box>
          </HStack>
          <Text fontSize="14px" mt="8px">Lorem ipsum dolor sit amet, consectetur adipiscing elit donec consectetur semper nunc in molestie.</Text>
          <HStack mt="8px" spacing="16px">
              <HStack spacing="4px">
                  <IconButton aria-label="Upvote Answer" icon={<ChevronUpIcon boxSize="20px" />} size="xs" variant="ghost" />
                  <Text fontSize="12px" fontWeight="light">5</Text>
              </HStack>
              <HStack spacing="4px">
                  <IconButton aria-label="Downvote Answer" icon={<ChevronDownIcon boxSize="20px" />} size="xs" variant="ghost" />
                  <Text fontSize="12px" fontWeight="light"></Text>
              </HStack>
          </HStack>
      </Box>
    </Box>
  );
};

export default QuestionCard; 