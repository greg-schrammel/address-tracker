import { Chain, ChainId } from '@features/wallet'

const MoralisApi = 'https://deep-index.moralis.io/api/v2'
const MoralisKey = 'qWAbQub9pPR3dbe8J9iJ8SGKguYNo7dtnp2gGsHdPjH9EDbY1lXyGmam1bca21Ua'

type MoralisChainId = 'eth' | 'bsc' | 'avalanche' | 'polygon'

export type NFT = {
  tokenId: string
  amount: number
  contractType: 'ERC721' | 'ERC1155'
  tokenURI: string
  metadata: {
    name: string
    description: string
    image: string
    animation_url?: string
    external_url: string
    attributes?: { trait_type: string; value: string }[]
  }
  owner: string
  syncedAt: string
}

const fetchNFTs = ({ address, chain }: { address: string; chain: MoralisChainId }) =>
  fetch(`${MoralisApi}/${address}/nft?chain=${chain}&format=decimal`, {
    headers: { 'X-API-Key': MoralisKey },
  }).then((d) => d.json())

export const nftsOf = async ({ address, chain }: { address: string; chain: MoralisChainId }) => {
  const { total, page, page_size, result: nfts, status } = await fetchNFTs({ address, chain })

  return nfts.map((nft) => {
    const metadata = JSON.parse(nft.metadata)
    return {
      contractAddress: nft.token_address,
      tokenId: nft.token_id,
      amount: nft.amount,
      owner: nft.owner_of,
      contractType: nft.contract_type,
      tokenURI: nft.token_uri,
      metadata: { ...metadata, image: metadata?.image || metadata?.image_url },
      syncedAt: nft.synced_at,
      name: nft.name,
      symbol: nft.symbol,
    } as NFT
  })
}

type AddressNFTs = { nfts?: NFT[]; error?: string }
export type AddressChainsNFTs = {
  [chain in ChainId]?: AddressNFTs
}

export const allNFTsOf = async (address): Promise<AddressChainsNFTs> => {
  const addressChains = Object.entries(Chain).filter(([chainId, chain]) =>
    chain.validateAddress(address),
  )
  if (addressChains.length === 0) throw new Error('Invalid wallet address')
  const balances = await Promise.all(
    addressChains.map(async ([chainId, chain]) => ({
      [chainId]: (await chain
        .fetchAddressNFTs({ address })
        .then((nfts) => (!!nfts?.length ? { nfts } : undefined))
        .catch((e) => ({ error: e.message }))) as { nfts?: NFT[]; error?: string },
    })),
  ).then((arr) => arr.reduce((acc, obj) => ({ ...acc, ...obj }), {}))

  return balances
}
