import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login' 
import Register from './pages/Auth/Register'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Add the Register route */}
          <Route path="*" element={<Navigate to="/login" replace />} /> {/* Redirects any other path to /login */}
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App 