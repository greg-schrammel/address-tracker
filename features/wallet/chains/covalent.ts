import { ethers } from 'ethers'

import { ChainId } from '.'
import { Token } from '..'

const CovalentApi = 'https://api.covalenthq.com/v1'
const CovalentKey = 'ckey_74081065f7d44bcb827e380b39b' //process.env.COVALENTHQ_API_KEY

const fetchBalances = ({ addressOrENS, chainId, quoteCurrency = 'usd' }) =>
  fetch(
    `${CovalentApi}/${chainId}/address/${addressOrENS}/balances_v2/?quote-currency=${quoteCurrency}&key=${CovalentKey}`,
  ).then((d) => d.json())

const fetchHistoricalPortfolio = ({ addressOrENS, chainId, quoteCurrency = 'usd' }) =>
  fetch(
    `${CovalentApi}/${chainId}/address/${addressOrENS}/portfolio_v2/?quote-currency=${quoteCurrency}&days=1&key=${CovalentKey}`,
  ).then((d) => d.json())

const fetchNFTs = ({ addressOrENS, chainId }) =>
  fetch(
    `${CovalentApi}/${chainId}/address/${addressOrENS}/balances_v2/?nft=true&key=${CovalentKey}`,
  ).then((d) => d.json())

export const balanceOf = async ({
  address,
  chainId,
}: {
  address: string
  chainId: ChainId
}): Promise<Token[]> => {
  const { data, error_message } = await fetchBalances({ addressOrENS: address, chainId })
  if (error_message) throw new Error(error_message)
  return data.items
    .map((token) => {
      const priceUSD = token.quote_rate
      // priceUsdOf({ contractAddress: token.contract_address, decimals: token.decimals }, chainId)
      const userBalance = parseFloat(
        ethers.utils.formatUnits(token.balance, token.contract_decimals).toString(),
      )
      return {
        contractAddress: token.contract_address,
        symbol: token.contract_ticker_symbol,
        name: token.contract_name,
        decimals: token.contract_decimals,
        image: token.logo_url,
        userBalance,
        priceUSD,
        priceUSD24HR: token.quote_rate_24h,
        userBalanceUSD: token.quote, // || priceUSD * userBalance,
      } as Token
    })
    .filter((t) => t.userBalance > 0)
}

const priceUsdOf = ({ contractAddress, decimals }, chainId) =>
  ({
    [ChainId.Avalanche]: () =>
      fetch(`https://api.traderjoexyz.com/priceusd/${contractAddress}`)
        .then((d) => d.text())
        .then((price) => ethers.utils.formatUnits(parseFloat(price), decimals) || undefined),
  }[chainId])

// export const nftsOf = async ({ address, chainId }) => {
//   const { data, error_message } = await fetchNFTs({ addressOrENS: address, chainId })
//   if (error_message) throw new Error(error_message)
//   return data.items
//     .map(
//       (token) =>
//         ({
//           contractAddress: token.contract_address,
//           symbol: token.contract_ticker_symbol,
//           name: token.contract_name,
//           decimals: token.contract_decimals,
//           image: token.logo_url,
//           userBalance: parseFloat(
//             ethers.utils.formatUnits(token.balance, token.contract_decimals).toString(),
//           ),
//           priceUSD: token.quote_rate,
//           userBalanceUSD: token.quote,
//         } as Token),
//     )
//     .filter((t) => t.userBalanceUSD > 0.1)
// }

// type NFTCollection = {
//   contractAddress: string,
//   symbol: string,
//   name: string,
//   logoURI: string,
//   balance: number,
//   // type: 'erc721' | 'erc1155'
// }

// type NFT = {
//   balance: number,
//   tokenId: string,
//   metadata: {
//     name: string,
//     description: string,
//     image: string,
//     animation_url: string,
//     external_url: string,
//     attributes: { trait_type: string, value: string }[]
// }
