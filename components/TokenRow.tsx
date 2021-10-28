import { useEffect, useRef, useState } from 'react'
import { Image } from '@components/base/Image'
import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { Chain, ChainId } from '@features/wallet'
import { formatBigNumber, formatCurrency } from '@lib/numberFormat'
import { green, red, slate } from '@radix-ui/colors'
import { CSS } from '@stitches/react'
import { TokenBalanceByChain } from './TokenList'
import * as HoverCard from '@radix-ui/react-hover-card'
import { ethers } from 'ethers'
import * as Tooltip from '@radix-ui/react-tooltip'
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard'
import { BiCopy } from 'react-icons/bi'

interface TokenRowProps {
  css: CSS
  img: string
  name: string
  symbol: string
  balance: number
  usdBalance: number
  tokenByChain: TokenBalanceByChain['contractAddress']
}

// `${address}: ${chainId}: ${formatCurrency(t?.userBalanceUSD)}`

const ExtraInfo = ({ tokenByChain }: { tokenByChain: TokenBalanceByChain['contractAddress'] }) => {
  return (
    <View>
      {Object.entries(tokenByChain).map(([chainId, chainData]) => (
        <HoverCard.Root openDelay={750} closeDelay={150} key={chainId}>
          <HoverCard.Trigger>
            <View css={{ p: 5, borderRadius: '50%', backgroundColor: Chain[chainId].color }}></View>
          </HoverCard.Trigger>
          <HoverCard.Content asChild side="bottom" align="start">
            <View
              css={{
                p: 10,
                px: 14,
                borderRadius: 8,
                borderTopLeftRadius: 6,
                ml: 4,
                flexDirection: 'column',
                background: 'white', // Chain[chainId].backgroundColor,
                boxShadow: `0px 0px 10px 0px ${Chain[chainId].backgroundColor}`,
                span: {
                  my: 2,
                },
              }}
            >
              <View css={{ flexDirection: 'column', gap: 6 }}>
                {Object.entries(chainData).map(([address, t]) => (
                  <View css={{ flexDirection: 'column' }} key={address}>
                    <Text css={{ fontWeight: '$medium', fontSize: '$xs', color: slate.slate10 }}>
                      {address.substr(0, 6)}...
                      {address.substr(address.length - 6, address.length)}
                    </Text>
                    <Text css={{ fontSize: '$regular' }}>
                      <Text css={{ fontWeight: '$bold', mr: 5, fontSize: '$regular' }}>
                        {Chain[chainId].nickname}
                      </Text>
                      {formatCurrency(t.userBalanceUSD)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </HoverCard.Content>
        </HoverCard.Root>
      ))}
    </View>
  )
}

const tokenImage = (contractAddress, chainId) =>
  ({
    [ChainId.Avalanche]: () =>
      `https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/${ethers.utils.getAddress(
        contractAddress,
      )}/logo.png`,
    [ChainId.Ethereum]: () =>
      `https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(
        contractAddress,
      )}/logo.png`,
    [ChainId.Polygon]: () =>
      `https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/polygon/assets/${ethers.utils.getAddress(
        contractAddress,
      )}/logo.png`,
    [ChainId.BSC]: () =>
      `https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/smartchain/assets/${ethers.utils.getAddress(
        contractAddress,
      )}/logo.png`,
    [ChainId.Solana]: () =>
      `https://raw.githubusercontent.com/rainbow-me/assets/master/blockchains/solana/assets/${contractAddress}/logo.png`,
  }[chainId]?.())

export const TokenRow = ({ css = {}, token, tokenByChain, ...props }) => {
  const priceVariance24hr = ((token.priceUSD - token.priceUSD24HR) / token.priceUSD24HR) * 100
  return (
    <View
      whileTap={{ scale: 0.95 }}
      css={{
        width: '100%',
        flexDirection: 'column',
        borderRadius: 14,
        // py: 8,
        // px: 8,
        p: 12,
        '&:hover': {
          backgroundColor: slate.slate2,
        },
        ...css,
      }}
    >
      <View
        css={{ alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}
        {...props}
      >
        <View css={{ alignItems: 'center' }}>
          <View css={{ borderRadius: '50%', height: 40, width: 40, overflow: 'hidden' }}>
            <Image
              sources={[
                token.image,
                ...Object.keys(tokenByChain).map((chainId) =>
                  tokenImage(token.contractAddress, chainId),
                ),
              ]}
              fallbackSrc={'/token-fallback.png'}
              height="40px"
              width="40px"
            />
          </View>
          <View css={{ flexDirection: 'column', ml: '1rem' }}>
            <Text css={{ fontSize: '$regular', fontWeight: '$bold', maxWidth: 200 }}>
              {token.name}
            </Text>
            <Text
              css={{
                fontSize: '$sm',
                fontWeight: '$medium',
                color: slate.slate11,
                mt: 2,
                maxWidth: 200,
              }}
            >{`${formatBigNumber(token.userBalance)} ${token.symbol}`}</Text>
          </View>
        </View>
        {!!token.userBalanceUSD && (
          <View css={{ flexDirection: 'column', alignItems: 'end' }}>
            <Text css={{ fontSize: '$regular', fontWeight: '$medium' }}>
              {formatCurrency(token.userBalanceUSD)}
            </Text>
            {!!token.priceUSD24HR && (
              <Text
                css={{
                  mt: 2,
                  color: priceVariance24hr > 0 ? green.green9 : red.red9,
                  fontSize: '$sm',
                  fontWeight: '$semibold',
                }}
              >
                {priceVariance24hr > 0 ? '+' : ''}
                {formatBigNumber(priceVariance24hr)}%
              </Text>
            )}
          </View>
        )}
        <View css={{ position: 'absolute', left: 8, bottom: -4, zIndex: 2 }}>
          <ExtraInfo tokenByChain={tokenByChain} />
        </View>
      </View>
      {/* {isOpen && (
        <View css={{ mt: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Text as="a" css={{ fontSize: '$xs', fontWeight: '$medium', color: slate.slate10 }}>
            Copy contract address
          </Text>
        </View>
      )} */}
    </View>
  )
}
