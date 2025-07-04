import React, { useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Avatar, 
  IconButton, 
  HStack, 
  Image, 
  Text, 
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';
import { SearchIcon, BellIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications } from '../../services/notifications';
import { useRef, useState } from 'react';

interface HomeHeaderProps {
  onSearchChange?: (searchTerm: string) => void;
  showSearch?: boolean;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const HomeHeader = ({ onSearchChange, showSearch = false, searchTerm = '', setSearchTerm }: HomeHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const queryClient = useQueryClient();

  // Check if we're on current user's profile page (not other user's profile)
  const isOnCurrentUserProfile = location.pathname === '/profile';

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange?.(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm?.(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsLogoutDialogOpen(false);
  };

  // Prefetch profile and notifications on hover
  const prefetchProfile = () => {
    queryClient.prefetchQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const { data } = await fetch('/api/profile').then(res => res.json());
        return data.data;
      },
      staleTime: 1000 * 60 * 10,
    });
  };
  const prefetchNotifications = () => {
    queryClient.prefetchQuery({
      queryKey: ['notifications', 1],
      queryFn: async () => {
        const { data } = await fetch('/api/notifications?page=1').then(res => res.json());
        return data;
      },
      staleTime: 1000 * 60 * 2,
    });
  };

  return (
    <>
      <Flex
        as="header"
        bg="#0078D4"
        color="white"
        p={["8px", "16px"]}
        align="center"
        boxShadow="md"
        direction="row"
        overflow="hidden"
      >
        {/* Left: Logo */}
        <Box flexShrink={0} mr={2}>
          <HStack spacing={["2px", "6px", "12px"]}>
            <Image src="/images/logo.png" alt="Sal Logo" maxH={["24px", "32px", "36px"]} filter="invert(1) brightness(2)" />
            <Text fontSize={["14px", "16px", "16px"]} color="whiteAlpha.800" display={{ base: "none", md: "inline" }}>any question</Text>
          </HStack>
        </Box>
        {/* Center: Search bar */}
        <Box flex="1" display="flex" justifyContent="center" mx={2}>
          {showSearch && (
            <InputGroup maxWidth="300px" w="100%">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" boxSize={["16px", "20px", "20px"]} />}
              />
              <Input
                type="text"
                placeholder="Search questions..."
                bg="white"
                borderRadius="full"
                h={["28px", "36px", "36px"]}
                color="black"
                textAlign="left"
                value={searchTerm}
                onChange={handleSearchChange}
                fontSize={["sm", "md", "md"]}
              />
            </InputGroup>
          )}
        </Box>
        {/* Right: User icons */}
        <HStack spacing={["2px", "6px", "12px"]} flexShrink={0}>
          <IconButton
            aria-label="Home"
            icon={<Box as={FaHome} boxSize={["20px", "24px", "28px"]} color="white" />}
            isRound={true}
            size={["sm", "md", "md"]}
            bg="transparent"
            color="white"
            _hover={{ bg: 'blue.600' }}
            as={RouterLink}
            to="/home"
          />
          <IconButton
            aria-label="Notifications"
            icon={
              <Box position="relative">
                <BellIcon boxSize={["20px", "24px", "28px"]} color="white" />
                {data?.unread_count > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-1"
                    right="-1"
                    fontSize="0.7em"
                  >
                    {data.unread_count}
                  </Badge>
                )}
              </Box>
            }
            isRound={true}
            size={["sm", "md", "md"]}
            bg="transparent"
            color="white"
            _hover={{ bg: 'blue.600' }}
            as={RouterLink}
            to="/notifications"
            onMouseEnter={prefetchNotifications}
          />
          <IconButton
            aria-label="Technical Support"
            title="Technical Support"
            icon={<QuestionOutlineIcon boxSize={["20px", "24px", "28px"]} color="white" />}
            isRound={true}
            size={["sm", "md", "md"]}
            bg="transparent"
            color="white"
            _hover={{ bg: 'blue.600' }}
            onClick={() => navigate('/support')}
          />
          {/* Profile Menu */}
          <Menu>
            <MenuButton
              as={Box}
              onMouseEnter={prefetchProfile}
              cursor="pointer"
            >
              <Avatar 
                w={["28px", "36px", "40px"]}
                h={["28px", "36px", "40px"]}
                name={user ? `${user.first_name} ${user.last_name}` : ''} 
                src={user?.avatar} 
              />
            </MenuButton>
            <MenuList>
              {!isOnCurrentUserProfile && (
                <MenuItem 
                  icon={<FaUser />} 
                  onClick={() => navigate('/profile')}
                  color="gray.700"
                  _hover={{ bg: 'blue.50' }}
                >
                  View Profile
                </MenuItem>
              )}
              <MenuItem 
                icon={<FaSignOutAlt />} 
                onClick={() => setIsLogoutDialogOpen(true)}
                color="red.500"
                _hover={{ bg: 'red.50' }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsLogoutDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to logout? You will need to sign in again to access your account.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default HomeHeader; 