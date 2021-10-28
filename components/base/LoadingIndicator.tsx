import { slate } from '@radix-ui/colors'
import Loading from 'react-loading'

export const LoadingIndicator = ({ size = 24 }) => (
  <Loading type="spokes" color={slate.slate9} width={size} height={size} />
)
