import { motion } from 'framer-motion'
import { styled } from 'theme'

export const Input = styled(motion.input, {
  fontSize: '$regular',
  fontWeight: '$semibold',
  color: '$highContrast',
  width: '100%',
  '&::placeholder': {
    color: '$lowContrast',
  },
})
