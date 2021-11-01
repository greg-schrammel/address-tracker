import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { motion } from 'framer-motion'

import { styled } from 'theme'
import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { Image } from '@components/base/Image'

const StyledLink = styled('a', {
  cursor: 'pointer',
  fontSize: '$regular',
  fontWeight: '$bold',
  color: 'black',
  '&:visited': { color: 'black' },
})

const LogoText = styled(StyledLink, {
  '&:hover': {
    opacity: 0.6,
  },
  '&:focus': {
    opacity: 0.6,
  },
})

const GithubIcon = styled(FaGithub, {
  opacity: 0.25,
  '&:hover': {
    opacity: 1,
  },
  '&:focus': {
    opacity: 1,
  },
})

export const Header = () => (
  <View
    css={{
      alignItems: 'start',
      justifyContent: 'space-between',
      maxWidth: '1280px',
      p: '1.5rem',
      mx: 'auto',
    }}
  >
    <Link href="/" passHref>
      <LogoText>some logo idk</LogoText>
    </Link>
    <Link href="https://github.com/greg-schrammel/address-tracker" passHref>
      <StyledLink>
        <GithubIcon size={24} />
      </StyledLink>
    </Link>
  </View>
)
