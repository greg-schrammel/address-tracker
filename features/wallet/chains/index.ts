import { validate } from 'trezor-address-validator'
import * as covalent from './covalent'
import * as btc from './btc'
import * as solana from './solana'
import { Token } from '../fetchBalances'

export enum ChainId {
  Ethereum = 1,
  Polygon = 137,
  Arbitrum = 42161,
  BSC = 56,
  Fantom = 250,
  Avalanche = 43114,
  Bitcoin = 'bitcoin',
  Solana = 'solana',
}

type ChainConfig = {
  nickname: string
  displayFullName: string
  color: string
  backgroundColor: string
  fetchAddressData: ({ address }) => Promise<Token[]>
  validateAddress: (address: string) => boolean
}

const validateEVMAddress = (address) => validate(address, 'eth')

export const Chain: { [chainId in ChainId]?: ChainConfig } = {
  [ChainId.Ethereum]: {
    nickname: 'ETH',
    displayFullName: 'Ethereum',
    color: '#0057FF',
    backgroundColor: '#0057FF1A', // '#e5eeff',
    fetchAddressData: ({ address }) => covalent.balanceOf({ address, chainId: ChainId.Ethereum }),
    validateAddress: validateEVMAddress,
  },
  [ChainId.Fantom]: {
    nickname: 'FTM',
    displayFullName: 'Fantom',
    color: '#1969ff',
    backgroundColor: '#1969ff2e', // '#d6e4ff',
    fetchAddressData: ({ address }) => covalent.balanceOf({ address, chainId: ChainId.Fantom }),
    validateAddress: validateEVMAddress,
  },
  [ChainId.Avalanche]: {
    nickname: 'AVAX',
    displayFullName: 'Avalanche C-Chain',
    color: '#e84142',
    backgroundColor: '#e841424d', // '#f8c6c6',
    fetchAddressData: ({ address }) => covalent.balanceOf({ address, chainId: ChainId.Avalanche }),
    validateAddress: validateEVMAddress,
  },
  [ChainId.Arbitrum]: {
    nickname: 'AETH',
    displayFullName: 'Arbitrum',
    color: '#2d374b',
    backgroundColor: '#96bedcc9', // '#accce3',
    fetchAddressData: ({ address }) => covalent.balanceOf({ address, chainId: ChainId.Arbitrum }),
    validateAddress: validateEVMAddress,
  },
  [ChainId.BSC]: {
    nickname: 'BSC',
    displayFullName: 'Binance Smart Chain',
    color: '#F0B90B',
    backgroundColor: '#F0B90B33', // '#fcf1ce',
    fetchAddressData: ({ address }) => covalent.balanceOf({ address, chainId: ChainId.BSC }),
    validateAddress: validateEVMAddress,
  },
  [ChainId.Polygon]: {
    nickname: 'POLY',
    displayFullName: 'Polygon',
    color: '#5E62FF',
    backgroundColor: '#5E62FF33', // '#dfe0ff',
    fetchAddressData: ({ address }) => covalent.balanceOf({ address, chainId: ChainId.Polygon }),
    validateAddress: validateEVMAddress,
  },
  [ChainId.Solana]: {
    nickname: 'SOL',
    displayFullName: 'Solana',
    color: '#8f4af6',
    backgroundColor: '#8f4af633', // '#e9dbfd',
    fetchAddressData: solana.balanceOf,
    validateAddress: solana.validateAddress,
  },
  [ChainId.Bitcoin]: {
    nickname: 'BTC',
    displayFullName: 'Bitcoin',
    color: '#FF7A00',
    backgroundColor: '#FF7A0033', //'#fee4cc',
    fetchAddressData: btc.balanceOf,
    validateAddress: (address) => validate(address, 'btc'),
  },
}
export const Chains = Object.values(Chain)
