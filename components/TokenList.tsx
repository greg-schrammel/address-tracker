import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { TokenRow } from '@components/TokenRow'
import { ChainId, Token } from '@features/wallet'
import { mergeTokens } from '@lib/mergeTokens'
import { formatCurrency } from '@lib/numberFormat'
import { AddressData, AddressesChainFilter } from '@pages/dashboard'
import { slate } from '@radix-ui/colors'
import deepmerge from 'deepmerge'
import { AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { UseQueryResult } from 'react-query'

export const sumTokensBalanceUSD = (total, token: Token) => (total += token.userBalanceUSD) || total
const sortByUSDBalance = (a, b) => (a.userBalanceUSD < b.userBalanceUSD ? 1 : -1)

const filterAndMergeTokens = (
  addressesData: AddressData[],
  addressesChainFilter: AddressesChainFilter,
) =>
  mergeTokens(
    addressesData.map(
      ({ address, balances }) =>
        balances &&
        mergeTokens(
          Object.entries(balances).map(([chainId, { balances }]) => {
            if (addressesChainFilter[address]?.find((c) => c === chainId)) return []
            return balances
          }),
        ),
    ),
  ).filter((t) => !t.error)

export type TokenBalanceByChain = {
  [tokenContractAddress: string]: Record<ChainId, { [walletAddress: string]: Token }>
}

const mapTokenBalanceChain = (tokens = [], addressesData: AddressData[]): TokenBalanceByChain =>
  tokens.reduce(
    (accTokens, token) =>
      token && {
        ...accTokens,
        [token.contractAddress]: addressesData.reduce((aAddrs, { address, balances }) => {
          const tokenBalanceByChain = Object.entries(balances).reduce(
            (accChains, [chainId, chain]) => {
              const chainBalance = chain.balances?.find(
                (t) => t.contractAddress === token.contractAddress,
              )
              if (!chainBalance) return accChains
              return {
                ...accChains,
                [chainId]: {
                  [address]: chainBalance,
                },
              }
            },
            {},
          )
          return deepmerge(aAddrs, tokenBalanceByChain)
        }, {}),
      },
    {},
  )

export const TokenList = ({
  addressesQueryData,
  addressesChainFilter,
}: {
  addressesQueryData: UseQueryResult<AddressData>[]
  addressesChainFilter: AddressesChainFilter
}) => {
  const addressesData = addressesQueryData.map((d) => d.data)
  const filteredAndMergedAddressChainBalances = useMemo(
    () => filterAndMergeTokens(addressesData, addressesChainFilter),
    [JSON.stringify([addressesData, addressesChainFilter])],
  )
  const isLoading = !addressesQueryData.find(
    (addressData) => !addressData.isLoading && !!addressData.data,
  )
  const tokens = !isLoading && filteredAndMergedAddressChainBalances

  const tokenBalanceByChain = useMemo(
    () => mapTokenBalanceChain(tokens, addressesData),
    [JSON.stringify(tokens)],
  )

  if (!tokens || tokens.length === 0)
    return <Text css={{ fontWeight: '$semibold', color: slate.slate10 }}>No tokens here yet</Text>
  return (
    <>
      <View
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '100%',
          mb: '1rem',
          lineHeight: '36px',
        }}
      >
        <Text css={{ fontSize: '$lg', fontWeight: '$medium' }}>
          <Text css={{ fontWeight: '$extrabold', fontSize: '$lg' }}>Total Value:</Text>{' '}
          {formatCurrency(tokens.reduce(sumTokensBalanceUSD, 0))}
        </Text>
      </View>
      <View
        css={{
          width: '100%',
          maxWidth: 1000,
          display: 'grid',
          gap: '15px 30px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px,min-content))',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence>
          {tokens.sort(sortByUSDBalance).map((token, i) => (
            <TokenRow
              key={token.contractAddress}
              token={token}
              tokenByChain={tokenBalanceByChain[token.contractAddress]}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={{
                visible: (i) => ({
                  opacity: 1,
                  transition: {
                    delay: i * 0.1,
                  },
                }),
                hidden: { opacity: 0 },
              }}
            />
          ))}
        </AnimatePresence>
      </View>
    </>
  )
}
