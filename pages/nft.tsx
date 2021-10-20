import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { addressesFromQueryString } from '@lib/addressesFromQueryString'
import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { LoadingIndicator } from '@components/base/LoadingIndicator'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { NFT, nftsOf } from '@features/nft'
import { slate } from '@radix-ui/colors'
import { useQuery } from 'react-query'

export const getServerSideProps = async (ctx) => {
  const addresses = addressesFromQueryString(ctx.query.a)
  if (addresses.length === 0)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  return {
    props: {
      address: addresses[0],
    },
  }
}

const ipfsLink = (link) =>
  link &&
  (link.startsWith('http')
    ? link
    : 'https://cloudflare-ipfs.com' + link.replace('ipfs://', '/ipfs/')
  ).replace('/ipfs/ipfs/', '/ipfs/')

const NFTItem = ({ nft }: { nft: NFT }) => {
  const metadata = nft.metadata
  return (
    metadata && (
      <View
        whileTap={{ scale: 0.95 }}
        css={{
          width: '100%',
          flexDirection: 'column',
          borderRadius: 14,
          p: 12,
          '&:hover': {
            backgroundColor: slate.slate2,
          },
        }}
      >
        <img src={ipfsLink(metadata.image)} width={200} height={200} />
        <Text css={{ fontSize: '$md', fontWeight: '$bold' }}>{metadata.name}</Text>
      </View>
    )
  )
}

const NFTList = ({ nfts }: { nfts: NFT[] }) => {
  console.log(nfts)
  return (
    <View
      css={{
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '100%',
        mb: '1rem',
        lineHeight: '36px',
      }}
    >
      <View
        css={{
          width: '100%',
          maxWidth: 1000,
          display: 'grid',
          gap: '15px 30px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px,min-content))',
          justifyContent: 'center',
        }}
      >
        {nfts.map((nft) => (
          <NFTItem nft={nft} key={nft.tokenURI} />
        ))}
      </View>
    </View>
  )
}

export default function App({ address }) {
  const nftQuery = useQuery(['nfts', address], () => nftsOf({ address, chain: 'eth' }))
  const isLoading = nftQuery.isLoading || !nftQuery.data
  return (
    <>
      <Header />
      <View
        css={{
          maxWidth: '1280px',
          px: '1rem',
          mx: 'auto',
          flexDirection: 'column',
        }}
      >
        <View
          css={{
            width: '100%',
            flexDirection: 'column',
            mx: 'auto',
            alignItems: 'center',
          }}
        >
          <View css={{ flexDirection: 'column', alignItems: 'center', width: '100%', mt: '2rem' }}>
            {isLoading ? (
              <View css={{ flexDirection: 'column', alignItems: 'center' }}>
                <LoadingIndicator />
              </View>
            ) : (
              <NFTList nfts={nftQuery.data} />
            )}
          </View>
        </View>
      </View>
      <Footer />
    </>
  )
}
