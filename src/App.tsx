import { ChakraProvider, Skeleton, Spinner, Flex, Text } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import theme from './theme'
import { AuthProvider } from './contexts/AuthContext'
import AuthGuard from './components/common/AuthGuard'
import GuestGuard from './components/common/GuestGuard'
import { Suspense, lazy } from 'react'

const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const Home = lazy(() => import('./pages/Home/Home'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const NotificationsPage = lazy(() => import('./pages/Home/Notifications'))
const QuestionDetails = lazy(() => import('./pages/Home/QuestionDetails'))
const Support = lazy(() => import('./pages/Home/Support'))

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
      <Router>
            <Suspense fallback={
              <Flex minH="100vh" align="center" justify="center" direction="column">
                <Spinner size="xl" color="blue.500" mb={4} />
                <Text fontSize="lg" color="gray.600">Loading...</Text>
              </Flex>
            }> 
              <Routes>
                <Route path="/login" element={
                  <GuestGuard>
                    <Login />
                  </GuestGuard>
                } />
                <Route path="/register" element={
                  <GuestGuard>
                    <Register />
                  </GuestGuard>
                } />
                <Route path="/home" element={
                  <AuthGuard>
                    <Home />
                  </AuthGuard>
                } />
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                <Route path="/users/:username" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                <Route path="/notifications" element={
                  <AuthGuard>
                    <NotificationsPage />
                  </AuthGuard>
                } />
                <Route path="/questions/:id" element={
                  <AuthGuard>
                    <QuestionDetails />
                  </AuthGuard>
                } />
                <Route path="/support" element={
                  <AuthGuard>
                    <Support />
                  </AuthGuard>
                } />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Suspense>
      </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App 