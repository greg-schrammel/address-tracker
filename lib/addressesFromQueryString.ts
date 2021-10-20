import { isSupportedAddress } from './validateAddress'

export const addressesFromQueryString = (query) =>
  [...new Set(query?.toString().split(','))].filter(isSupportedAddress)
