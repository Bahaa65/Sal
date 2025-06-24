import { extendTheme } from '@chakra-ui/theme-utils'
import type { ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  direction: 'ltr',
})

export default theme 