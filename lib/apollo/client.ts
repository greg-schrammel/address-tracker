import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const defaultOptions = {
  query: {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
  },
  watchQuery: {
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
  },
} as const

// export const uniswapClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   defaultOptions,
//   link: new HttpLink({
//     uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
//   }),
// })

export const ensClient = new ApolloClient({
  cache: new InMemoryCache(),
  defaultOptions,
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  }),
})
