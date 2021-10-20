import { Chain, ChainId } from '.'
import { contractBlacklist } from './blacklist'

export type Token = {
  contractAddress?: string
  symbol: string
  name: string
  decimals: number
  userBalance: number
  userBalanceUSD?: number
  tokenPriceUSD?: number
  tokenPriceUSD24HR?: number
  priceUSD: number
  image: string
  error?: string
}

type AddressBalance = { balances?: Token[]; error?: string }
export type AddressesBalances = {
  [chain in ChainId]?: AddressBalance
}

export const balanceOf = async (address, chainId: ChainId): Promise<AddressBalance> => {
  const chain = Chain[chainId]
  if (!chain.validateAddress(address)) throw new Error('Invalid wallet address')
  return chain
    .fetchAddressData({ address })
    .then((tokens) =>
      tokens.filter((token) => !contractBlacklist[chainId]?.includes(token.contractAddress)),
    )
    .then((tokens) => (!!tokens?.length ? { balances: tokens } : undefined))
    .catch((e) => ({ error: e.message })) as { balances?: Token[]; error?: string }
}

export const allBalancesOf = async (address): Promise<AddressesBalances> => {
  const addressChains = Object.entries(Chain).filter(([chainId, chain]) =>
    chain.validateAddress(address),
  )
  if (addressChains.length === 0) throw new Error('Invalid wallet address')
  const balances = await Promise.all(
    addressChains.map(async ([chainId, chain]) => ({
      [chainId]: (await chain
        .fetchAddressData({ address })
        .then((tokens) =>
          tokens.filter((token) => !contractBlacklist[chainId]?.includes(token.contractAddress)),
        )
        .then((tokens) => (!!tokens?.length ? { balances: tokens } : undefined))
        .catch((e) => ({ error: e.message }))) as { balances?: Token[]; error?: string },
    })),
  ).then((arr) => arr.reduce((acc, obj) => ({ ...acc, ...obj }), {}))

  return balances
}
