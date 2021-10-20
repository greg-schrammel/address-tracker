import * as solanaWeb3 from '@solana/web3.js'
import { TokenListProvider, TokenInfo, ENV } from '@solana/spl-token-registry/dist/main/index'
import { Market, MARKETS, Orderbook, TOKEN_MINTS } from '@project-serum/serum'
import { ethers } from 'ethers'
import { Token } from '..'

export const solana = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com', 'max')
const SolanaPubKey = solanaWeb3.PublicKey
const SPLTokenProgramId = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export const validateAddress = (address) => {
  try {
    return !!new SolanaPubKey(address)
  } catch {
    return false
  }
}

const bbo = (bidsBook: Orderbook, asksBook: Orderbook) => {
  const bestBid = bidsBook.getL2(1)
  const bestAsk = asksBook.getL2(1)
  if (bestBid.length > 0 && bestAsk.length > 0) return (bestBid[0][0] + bestAsk[0][0]) / 2.0
  return 0
}

const getPrice = async (marketInfo) => {
  if (!marketInfo) return 0
  const market = await Market.load(solana, marketInfo.address, {}, marketInfo.programId)
  const [bids, asks] = await Promise.all([market.loadBids(solana), market.loadAsks(solana)])
  return bbo(bids, asks)
}

const getMarketInfo = (tokenAddresses) =>
  tokenAddresses.reduce((acc, tokenAddress) => {
    const SERUM_TOKEN = TOKEN_MINTS.find((a) => a.address.toBase58() === tokenAddress)
    const marketInfo = MARKETS.filter((m) => !m.deprecated).find(
      (m) => m.name === `${SERUM_TOKEN?.name}/USDC` || m.name === `${SERUM_TOKEN?.name}/USDT`,
    )
    if (marketInfo) acc[tokenAddress] = { ...marketInfo }
    return acc
  }, {})

const WSOLAddress = 'So11111111111111111111111111111111111111112'

const getChainCoin = async (address, tokenList: TokenInfo[], markets) => {
  const token = tokenList.find((tl) => tl.symbol === 'SOL')
  const [balance, priceUSD] = await Promise.all([
    solana.getBalance(new SolanaPubKey(address), 'max'),
    getPrice(markets[WSOLAddress]),
  ])
  const userBalance = parseFloat(ethers.utils.formatUnits(balance, token.decimals).toString())
  return {
    contractAddress: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    decimals: token.decimals,
    image: token.logoURI,
    userBalance,
    priceUSD: priceUSD,
    userBalanceUSD: priceUSD * userBalance,
  }
}

export const balanceOf = async ({ address }): Promise<Token[]> => {
  const [tokens, tokenList] = await Promise.all([
    solana.getParsedTokenAccountsByOwner(
      new SolanaPubKey(address),
      { programId: SPLTokenProgramId },
      'max',
    ),
    new TokenListProvider()
      .resolve()
      .then((tokens) => tokens.filterByChainId(ENV.MainnetBeta).getList()),
  ])

  const markets = getMarketInfo([
    ...tokens.value.map((t) => t.account.data.parsed.info.mint),
    WSOLAddress,
  ])

  return Promise.all([
    getChainCoin(address, tokenList, markets),
    ...tokens.value
      .map((t) => ({
        ...tokenList.find((tl) => tl.address === t.account.data.parsed.info.mint),
        balance: t.account?.data?.parsed?.info?.tokenAmount?.uiAmount,
      }))
      .filter((t) => t.balance > 0)
      .map(async (token) => {
        const priceUSD = (await getPrice(markets[token.address])) || 0
        return {
          contractAddress: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          image: token.logoURI,
          userBalance: token.balance,
          priceUSD: priceUSD,
          userBalanceUSD: priceUSD * token.balance,
        }
      }),
  ])
}
