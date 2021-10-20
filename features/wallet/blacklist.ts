import { ChainId } from '.'

export const contractBlacklist = {
  [ChainId.Ethereum]: [
    '0x82dfdb2ec1aa6003ed4acba663403d7c2127ff67', // akSwap.io
  ],
  [ChainId.BSC]: [
    '0xd22202d23fe7de9e3dbe11a2a88f42f4cb9507cf', // minereum
    '0xb926beb62d7a680406e06327c87307c1ffc4ab09', // AlpacaDrop.com
    '0xb926beb62d7a680406e06327c87307c1ffc4ab09', // AlpacaDrop.org
    '0x373233a38ae21cf0c4f9de11570e7d5aa6824a1e', // ALPACAFIN.com
    '0x569b2cf0b745ef7fad04e8ae226251814b3395f9', // BSCToken.io
    '0xfcb5df42e06a39e233dc707bb3a80311efd11576', // www.METH.co.in
    '0xd54fd5d0c349c06373f3fe914151d1555b629fb6', // Bitcoin Anonymous
  ],
  [ChainId.Polygon]: [
    '0x6142f62e7996faec5c5bb9d10669d60299d69dfe', // SpaceRat.finance
    '0x81067076dcb7d3168ccf7036117b9d72051205e2', // dxDex.io
    '0x2e2dde47952b9c7defde7424d00dd2341ad927ca', // ChumChum
    '0x0364c8dbde082372e8d6a6137b45613dd0f8138a', // PolyBest.io
    '0x19a935cbaaa4099072479d521962588d7857d717', // LitCoin
  ],
}
