import React, { Children } from 'react'
import { styled } from 'theme'
import { slate } from '@radix-ui/colors'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { motion } from 'framer-motion'

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  // minWidth: 220,
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 2,
  boxShadow: '0px 3px 18px -3px rgba(22, 23, 24, 0.15)',
})

const itemStyles = {
  all: 'unset',
  fontSize: '$sm',
  fontWeight: '$semibold',
  m: 2,
  lineHeight: 1,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  px: 12,
  py: 8,
  // position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: slate.slate8,
    pointerEvents: 'none',
  },

  '&:focus': {
    backgroundColor: slate.slate3,
    transform: 'scale(1.02)',
  },
  '&:hover': {
    backgroundColor: slate.slate3,
    transform: 'scale(1.02)',
  },
}

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles })

// Exports
export const DropdownMenuRoot = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = StyledContent
export const DropdownMenuItem = motion(StyledItem)

export const DropdownMenu = ({ Trigger, children, ...props }) => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>{Trigger}</DropdownMenuTrigger>

      <DropdownMenuContent {...props} sideOffset={5}>
        {children}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}
