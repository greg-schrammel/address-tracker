import { Chains } from '@features/wallet'

export const isSupportedAddress = (address: string) => {
  const addressChain = Chains.find((chain) => chain.validateAddress(address))
  if (addressChain === undefined) return false
  return true
}
