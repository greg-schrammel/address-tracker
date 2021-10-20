import Loading from 'react-loading'

export const LoadingIndicator = ({ size = 24 }) => (
  <Loading type="spokes" color="black" width={size} height={size} />
)
