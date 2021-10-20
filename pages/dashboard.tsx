import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { addressesFromQueryString } from '@lib/addressesFromQueryString'
import ens from '@lib/ens'
import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { LoadingIndicator } from '@components/base/LoadingIndicator'
import { useQueriesTyped } from '@components/hooks/useQueriesTyped'
import { TrackingAddresses } from '@components/TrackingAddresses'
import { TokenList } from '@components/TokenList'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { AddressesBalances, ChainId } from '@features/wallet'

// const fetchBalances = ({ address }) => balancesOf(address) as Promise<AddressBalances>

const fetchBalances = ({ address }) =>
  fetch(`/api/${address}/all`).then(async (d) => {
    const r = await d.json()
    if (!d.ok) throw new Error('Opss something went wrong')
    return r
  }) as Promise<AddressesBalances>

export type AddressData = {
  address: string
  balances: AddressesBalances
  ens?: string
}

const fetchAddressData = async ({ address }) => {
  if (!address) return
  const [balances, ensName] = await Promise.all([fetchBalances({ address }), ens.lookup(address)])
  return {
    address,
    balances,
    ens: ensName,
  } as AddressData
}

const useAddresses = (addresses: Array<string>, filter: Record<string, ChainId[]> = {}) => {
  return useQueriesTyped(
    addresses.map((address) => ({
      queryKey: ['address', address],
      queryFn: () => fetchAddressData({ address }),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  ).map((queryResult, i) => {
    const address = addresses[i]
    // data is undefined on loading
    queryResult.data =
      queryResult.data ||
      ({
        address,
        balances: {},
        ens: '',
      } as AddressData)
    return queryResult
  })
}

export const getServerSideProps = async (ctx) => {
  const addresses = addressesFromQueryString(ctx.query.a)
  if (addresses.length === 0)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  return {
    props: {
      initialAddresses: addresses,
    },
  }
}

export type AddressesChainFilter = Record<string, ChainId[]>

const useAddressChainFilter = (initialAddressChainFilter = {}) => {
  const [addressesChainFilter, setAddressesChainFilter] =
    useState<AddressesChainFilter>(initialAddressChainFilter)
  const toggleAddressChainFilter = ({ address, chain }) => {
    let addressChainFilter = addressesChainFilter[address] || []
    if (addressChainFilter.find((c) => c === chain))
      addressChainFilter = addressChainFilter.filter((c) => c !== chain)
    else addressChainFilter.push(chain)
    setAddressesChainFilter({ ...addressesChainFilter, [address]: addressChainFilter })
  }
  return { toggleAddressChainFilter, addressesChainFilter }
}

export default function App({ initialAddresses, initialAddressChainFilter }) {
  const router = useRouter()
  const [addresses, setAddresses] = useState(initialAddresses)
  const { toggleAddressChainFilter, addressesChainFilter } =
    useAddressChainFilter(initialAddressChainFilter)
  const addressesQueryData = useAddresses(addresses)
  const isLoading = !addressesQueryData.find(
    (addressData) => !addressData.isLoading && !!addressData.data,
  )
  useEffect(() => {
    router.replace(addresses.length ? `/dashboard?a=${addresses}` : '/')
  }, [addresses])
  const removeAddress = (address) => {
    setAddresses(addresses.filter((a) => a !== address))
  }
  const addAddress = ({ address }) => {
    setAddresses([...addresses, address])
  }
  console.log(addressesQueryData[0].data)
  return (
    <>
      <Header />
      <View
        css={{
          maxWidth: '1280px',
          px: '1rem',
          mx: 'auto',
          flexDirection: 'column',
        }}
      >
        <View
          css={{
            width: '100%',
            flexDirection: 'column',
            mx: 'auto',
            alignItems: 'center',
          }}
        >
          <TrackingAddresses
            toggleAddressChainFilter={toggleAddressChainFilter}
            addressesChainFilter={addressesChainFilter}
            removeAddress={removeAddress}
            addAddress={addAddress}
            addressesData={addressesQueryData}
          />
          <View css={{ flexDirection: 'column', alignItems: 'center', width: '100%', mt: '2rem' }}>
            {isLoading ? (
              <View css={{ flexDirection: 'column', alignItems: 'center' }}>
                <LoadingIndicator />
                <Text css={{ mt: 5, fontWeight: '$medium', fontSize: '$sm' }}>Loading</Text>
              </View>
            ) : (
              <TokenList
                addressesQueryData={addressesQueryData}
                addressesChainFilter={addressesChainFilter}
              />
            )}
          </View>
        </View>
      </View>
      <Footer />
    </>
  )
}
