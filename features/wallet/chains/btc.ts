import { ethers } from 'ethers'
import { Token } from '..'

const jsonFetch = (url) => fetch(url).then((d) => d.json())

const fetchBTCBalance = async (userAddress) => {
  const balance = await jsonFetch(
    `https://api.blockcypher.com/v1/btc/main/addrs/${userAddress}/balance`,
  ).then((d) => d.balance)
  if (balance) return balance
  return jsonFetch(`https://blockchain.info/address/${userAddress}?format=json`).then(
    (d) => d.final_balance,
  )
}
const fetchBTCPrice = () => fetch(`https://blockchain.info/ticker`).then((d) => d.json())

export const balanceOf = async ({ address }): Promise<Token[]> => {
  try {
    const [balance, price] = await Promise.all([fetchBTCBalance(address), fetchBTCPrice()])
    if (balance === undefined) throw new Error(`Couldn't fetch BTC address data`)
    if (!balance) return []
    const parsedBalance = parseFloat(ethers.utils.formatUnits(balance, 8))
    return [
      {
        contractAddress: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        decimals: 8,
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        userBalance: parsedBalance,
        priceUSD: price.USD?.last,
        userBalanceUSD: parsedBalance * price.USD?.last,
      } as Token,
    ]
  } catch (e) {
    throw new Error('Something went wrong')
  }
}
