import { styled, keyframes } from '@stitches/react'
import { violet, blackA, red, mauve } from '@radix-ui/colors'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
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

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, {
  backgroundColor: blackA.blackA9,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
})

function Root({ children, ...props }) {
  return (
    <AlertDialogPrimitive.Root {...props}>
      <StyledOverlay />
      {children}
    </AlertDialogPrimitive.Root>
  )
}

const StyledContent = styled(AlertDialogPrimitive.Content, {
  backgroundColor: 'white',
  borderRadius: 12,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: 20,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: 'transform',
  },
  '&:focus': { outline: 'none' },
})

const StyledTitle = styled(AlertDialogPrimitive.Title, {
  margin: 0,
  color: mauve.mauve12,
  fontSize: 18,
  fontWeight: 600,
})

const StyledDescription = styled(AlertDialogPrimitive.Description, {
  marginBottom: 20,
  color: mauve.mauve10,
  fontSize: 15,
  lineHeight: 1.5,
})

// Exports
const AlertDialogRoot = Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogContent = StyledContent
export const AlertDialogTitle = StyledTitle
export const AlertDialogDescription = StyledDescription
const AlertDialogAction = AlertDialogPrimitive.Action
const AlertDialogCancel = AlertDialogPrimitive.Cancel

export const AlertDialog = ({ title, description, Trigger, ConfirmButton, children = null }) => (
  <AlertDialogRoot>
    <AlertDialogTrigger asChild>{Trigger}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogTitle>{title}</AlertDialogTitle>
      <AlertDialogDescription>{description}</AlertDialogDescription>
      {children}
      <View css={{ justifyContent: 'flex-end', mt: '1rem' }}>
        <AlertDialogCancel asChild>
          <Button variant="mauve" css={{ marginRight: 10 }}>
            Cancel
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>{ConfirmButton}</AlertDialogAction>
      </View>
    </AlertDialogContent>
  </AlertDialogRoot>
)
