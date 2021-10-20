import { keyframes } from '@stitches/react'
import { styled } from 'theme'
import { violet, blackA, red, mauve } from '@radix-ui/colors'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { View } from './View'
import { Button } from './Button'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: blackA.blackA9,
  position: 'fixed',
  inset: 0,
  maxWidth: '100vw',
  maxHeight: '100vh',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
})

function Root({ children, ...props }) {
  return (
    <DialogPrimitive.Root {...props}>
      <StyledOverlay />
      {children}
    </DialogPrimitive.Root>
  )
}

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: 'white',
  borderRadius: 12,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '400px',
  // maxHeight: '85vh',
  padding: 20,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 300ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: 'transform',
  },
  '&:focus': { outline: 'none' },
})

const StyledTitle = styled(DialogPrimitive.Title, {
  margin: 0,
  color: mauve.mauve12,
  fontSize: 18,
  fontWeight: 600,
})

const StyledDescription = styled(DialogPrimitive.Description, {
  marginBottom: 20,
  color: mauve.mauve10,
  fontSize: 15,
  lineHeight: 1.5,
})

// Exports
const DialogRoot = Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogContent = StyledContent
const DialogTitle = StyledTitle
const DialogDescription = StyledDescription

export const Dialog = ({
  open,
  onOpenChange,
  onPointerDownOutside,
  onEscapeKeyDown,
  title,
  description,
  Trigger,
  ConfirmButton,
  children = null,
}) => {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent onPointerDownOutside={onPointerDownOutside} onEscapeKeyDown={onEscapeKeyDown}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {children}
        <View css={{ justifyContent: 'flex-end', mt: '1rem' }}>
          <DialogPrimitive.Close asChild>
            <Button variant="secondary" css={{ marginRight: 10 }}>
              Cancel
            </Button>
          </DialogPrimitive.Close>
          {ConfirmButton}
        </View>
      </DialogContent>
    </DialogRoot>
  )
}
