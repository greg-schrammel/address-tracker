import React from 'react'
import { IdProvider } from '@radix-ui/react-id'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { globalStyles } from '@theme'

export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient())
  globalStyles()
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <IdProvider>
          <Component {...pageProps} />
        </IdProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}
