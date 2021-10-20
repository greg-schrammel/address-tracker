import { motion } from 'framer-motion'

import { Text } from '@components/base/Text'
import { View } from '@components/base/View'

export const Footer = () => (
  <View
    css={{
      alignItems: 'center',
      justifyContent: 'right',
      p: '1.5rem',
      pb: '2rem',
      pt: '4rem',
      mx: 'auto',
      mt: 'auto',
    }}
  >
    <Text
      as={motion.a}
      href="https://twitter.com/___gregs"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      whileFocus={{ scale: 1.1 }}
      css={{
        fontSize: '$regular',
        fontWeight: '$bold',
        color: 'black',
        cursor: 'pointer',
        '&:hover': {
          color: 'white',
          textShadow: '3px 2px 5px #5f2ed3, -2px -3px 7px #E488FF',
        },
        '&:focus': {
          color: 'white',
          textShadow: '3px 2px 5px #5f2ed3, -2px -3px 7px #E488FF',
        },
      }}
    >
      by greg
    </Text>
  </View>
)
