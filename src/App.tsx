import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import theme from './theme'
import Login from './pages/Auth/Login' 
import Register from './pages/Auth/Register'
import Home from './pages/Home/Home'
import { AuthProvider } from './contexts/AuthContext'
import AuthGuard from './components/common/AuthGuard'
import GuestGuard from './components/common/GuestGuard'
import Profile from './pages/Profile/Profile'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <AuthGuard>
                    <Home />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                }
              />

              {/* Guest-only Routes */}
              <Route
                path="/login"
                element={
                  <GuestGuard>
                    <Login />
                  </GuestGuard>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestGuard>
                    <Register />
                  </GuestGuard>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App 