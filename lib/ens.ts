import { ethers } from 'ethers'
import { ensClient } from 'lib/apollo/client'
import { ENS_SUGGESTIONS } from 'lib/apollo/queries'

export const fetchENSSuggestions = async (recipient) => {
  if (recipient.length === 0) return null
  const recpt = recipient.toLowerCase()
  let result = await ensClient.query({
    query: ENS_SUGGESTIONS,
    variables: {
      amount: 3,
      name: recpt,
    },
  })
  if (result?.data?.domains?.length != 0)
    return result.data.domains
      .map((ensDomain) => ({
        address: ensDomain.resolver.addr.id,
        ens: ensDomain.name,
      }))
      .filter((domain) => !domain.ens.includes('[')) as { address: string; ens: string }[]
}

const ethProvider = new ethers.providers.JsonRpcProvider(
  'https://speedy-nodes-nyc.moralis.io/f6ea1b4284b17b715d8db843/eth/mainnet',
)
export const lookup = async (address) => ethProvider.lookupAddress(address).catch(() => null)
export const resolve = (ensName: string) =>
  ethProvider.resolveName(ensName.indexOf('.') !== -1 ? ensName : ensName + '.eth')

export default { lookup, resolve }
