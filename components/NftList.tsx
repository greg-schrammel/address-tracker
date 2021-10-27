import { useState } from 'react'

import { addressesFromQueryString } from '@lib/addressesFromQueryString'
import { View } from '@components/base/View'
import { LoadingIndicator } from '@components/base/LoadingIndicator'
import { NFT, nftsOf } from '@features/nft'
import { slate } from '@radix-ui/colors'
import { useQuery } from 'react-query'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

const ipfsLink = (link) =>
  link &&
  (link.startsWith('http')
    ? link
    : 'https://cloudflare-ipfs.com' + link.replace('ipfs://', '/ipfs/')
  ).replace('/ipfs/ipfs/', '/ipfs/')

const NFTItem = ({ nft }: { nft: NFT }) => {
  const metadata = nft.metadata
  const imageLink = ipfsLink(metadata.image)
  const isVideo = imageLink?.endsWith('.mp4')
  const [isLoading, setIsLoading] = useState(true)
  return (
    <View
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      css={{ borderRadius: 12, overflow: 'hidden', width: '100%' }}
    >
      {isLoading && <View css={{ width: '100%', height: 150, backgroundColor: slate.slate6 }} />}
      {isVideo ? (
        <video
          autoPlay
          playsInline
          src={imageLink}
          width="100%"
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      ) : (
        <img
          src={imageLink}
          width="100%"
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      )}
    </View>
  )
}

const NFTList = ({ nfts }: { nfts: NFT[] }) => {
  return (
    <View css={{ width: '100%', maxWidth: 750 }}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3 }}>
        <Masonry gutter="12px" columnsCount={3}>
          {nfts
            .filter((nft) => nft?.metadata?.image)
            .map((nft) => (
              <NFTItem nft={nft} key={nft.tokenURI} />
            ))}
        </Masonry>
      </ResponsiveMasonry>
    </View>
  )
}

export const NFTs = ({ address }) => {
  const nftQuery = useQuery(['nfts', address], () => nftsOf({ address, chain: 'eth' }), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  const isLoading = nftQuery.isLoading || !nftQuery.data
  return (
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
  )
}
