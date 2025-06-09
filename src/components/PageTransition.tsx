import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { pageTransition } from './common/animations'

const MotionBox = motion.create(Box)

interface PageTransitionProps {
  children: ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <MotionBox
      {...pageTransition}
      width="100%"
    >
      {children}
    </MotionBox>
  )
}

export default PageTransition 