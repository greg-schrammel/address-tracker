import { violet, blackA, red, mauve, blue, slate } from '@radix-ui/colors'
import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { styled } from 'theme'

const MotionButton = forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>((props, ref) => (
  <motion.button
    ref={ref}
    whileHover={{ scale: 1.02 }}
    whileFocus={{ scale: 1.03 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  />
))

export const Button = styled(MotionButton, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  px: 15,
  py: 10,
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 'fit-content',
  border: `solid 1px transparent`,

  variants: {
    size: {
      default: {
        '&:focus': { boxShadow: `0 0 0 2px $$focusBoxShadowColor` },
      },
      large: {
        '&:focus': {
          boxShadow: `0 0 0 4px $$focusBoxShadowColor`,
        },
        px: 32,
        py: 12,
        borderRadius: 12,
        fontSize: '$md',
        fontWeight: '$bold',
      },
    },
    variant: {
      raw: {
        // color: 'black',
        // '&:hover': { opacity: 0.65 },
        // '&:focus': { opacity: 0.65 },
      },
      secondary: {
        // backgroundColor: mauve.mauve3,
        color: mauve.mauve11,
        '&:hover': { backgroundColor: mauve.mauve5 },
        $$focusBoxShadowColor: mauve.mauve7,
      },
      black: {
        backgroundColor: 'black',
        fontWeight: '$semibold',
        color: 'white',
        '&:hover': { opacity: 0.8 },
        $$focusBoxShadowColor: blackA.blackA7,
      },
      slate: {
        backgroundColor: slate.slate4,
        color: slate.slate11,
        '&:hover': {
          backgroundColor: slate.slate5,
          border: `solid 1px ${slate.slate7}`,
          color: 'black',
        },
        $$focusBoxShadowColor: slate.slate7,
      },
      red: {
        backgroundColor: red.red4,
        color: red.red11,
        '&:hover': { backgroundColor: red.red5 },
        $$focusBoxShadowColor: red.red7,
      },
      mauve: {
        // backgroundColor: mauve.mauve3,
        color: 'black',
        '&:hover': { backgroundColor: mauve.mauve3 },
        $$focusBoxShadowColor: mauve.mauve6,
      },
      blue: {
        backgroundColor: blue.blue4,
        color: blue.blue9,
        '&:hover': { backgroundColor: blue.blue5 },
        $$focusBoxShadowColor: blue.blue7,
      },
      violet: {
        backgroundColor: violet.violet4,
        color: violet.violet9,
        '&:hover': { backgroundColor: violet.violet5 },
        $$focusBoxShadowColor: violet.violet7,
      },
    },
  },

  defaultVariants: {
    variant: 'raw',
    size: 'default',
  },
})
