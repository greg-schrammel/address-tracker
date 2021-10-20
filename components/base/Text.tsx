import { motion } from 'framer-motion'
import { styled } from '@theme'

const StyledText = styled(motion.span, {
  color: '$highContrast',
  fontSize: '$md',
})

export const Text = StyledText
