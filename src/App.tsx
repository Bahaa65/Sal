import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div>Hello World</div>
    </ChakraProvider>
  )
}

export default App 