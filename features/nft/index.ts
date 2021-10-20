const MoralisApi = 'https://deep-index.moralis.io/api/v2'
const MoralisKey = 'qWAbQub9pPR3dbe8J9iJ8SGKguYNo7dtnp2gGsHdPjH9EDbY1lXyGmam1bca21Ua'

type MoralisChainId = 'eth' | 'bsc' | 'avalanche'

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

  return nfts.map(
    (nft) =>
      ({
        contractAddress: nft.token_address,
        tokenId: nft.token_id,
        amount: nft.amount,
        owner: nft.owner_of,
        contractType: nft.contract_type,
        tokenURI: nft.token_uri,
        metadata: JSON.parse(nft.metadata),
        syncedAt: nft.synced_at,
        name: nft.name,
        symbol: nft.symbol,
      } as NFT),
  )
}
