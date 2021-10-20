import { Token } from '@features/wallet'

export const mergeTokens = (allTokens: Token[][]) => {
  if (!allTokens || allTokens.length === 0) return []
  return Object.values(
    allTokens.flat().reduce((tokens, token) => {
      return !token
        ? tokens
        : {
            ...tokens,
            [token.contractAddress]: {
              ...token,
              userBalance:
                (tokens[token.contractAddress]?.userBalance || 0) + (token.userBalance || 0),
              userBalanceUSD:
                (tokens[token.contractAddress]?.userBalanceUSD || 0) + (token.userBalanceUSD || 0),
            },
          }
    }, {}),
  ) as Token[]
}
