import { forwardRef, useEffect, useRef, useState } from 'react'
import { UseQueryResult } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { BiDotsHorizontalRounded, BiPlus, BiSearch, BiX, BiCopy } from 'react-icons/bi'
import { slate, green, yellow, orange, red } from '@radix-ui/colors'

import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { Button } from '@components/base/Button'
import { LoadingIndicator } from '@components/base/LoadingIndicator'
import { AlertDialog } from '@components/base/AlertDialog'
import { ChainBadge } from './ChainBadge'
import { AddressData } from '@pages/dashboard'
import { ChainId, Chains } from '@features/wallet'
import { AddressInputContainer, SuggestionsCombobox, useAddressInput } from './SearchAddressInput'
import { sumTokensBalanceUSD } from './TokenList'
import { Dialog } from './base/Dialog'
import { toOxfordComma } from '@lib/textFormat'
import * as Tooltip from '@radix-ui/react-tooltip'
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard'
import { DropdownMenu, DropdownMenuItem } from './base/Dropdown'
import dynamic from 'next/dynamic'

const isEmptyObj = (obj = {}) => Object.keys(obj).length === 0

const CopyToClipboard = ({ children, textToCopy }) => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!open && copied) setCopied(false)
  }, [open])
  return (
    <Tooltip.Root onOpenChange={setOpen} open={open} delayDuration={0}>
      <Tooltip.Trigger asChild>
        <View>
          <ReactCopyToClipboard
            text={textToCopy}
            onCopy={() => {
              setCopied(true)
              setOpen(true)
            }}
          >
            {children}
          </ReactCopyToClipboard>
        </View>
      </Tooltip.Trigger>
      <Tooltip.Content asChild side="right">
        <View css={{ ml: 4 }}>
          {!copied ? (
            <BiCopy />
          ) : (
            <Text css={{ fontSize: '$sm', fontWeight: '$medium', color: green.green9 }}>
              Copied!
            </Text>
          )}
        </View>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const TrackedAddress = ({
  addressData,
  filter = [],
  onFilterChain,
  onRemove,
  ...props
}: {
  addressData: UseQueryResult<AddressData, unknown>
  [key: string]: any
}) => {
  const isLoading = addressData.isLoading || addressData.isRefetching
  const hasErrored = !isLoading && (addressData.isError || addressData.isRefetchError)
  const { balances, address, ens } = addressData.data
  const chains = isLoading
    ? []
    : (Object.entries(balances)
        .map(([chainId, balances]) => !isEmptyObj(balances) && chainId)
        .filter(Boolean) as ChainId[])
  const addressWithoutTokens = (!isLoading && chains.length === 0) || hasErrored
  const miniAddress = `${address.substr(0, 6)}...${address.substr(
    address.length - 6,
    address.length,
  )}`
  return (
    <View css={{ alignItems: 'center', width: '100%' }} {...props}>
      <View css={{ flexDirection: 'column', width: '100%' }}>
        <View css={{ justifyContent: 'space-between', width: '100%' }}>
          <View css={{ flexDirection: 'column', mb: 4 }}>
            <CopyToClipboard textToCopy={ens || address}>
              <Text
                css={{
                  fontWeight: '$semibold',
                  fontSize: '$regular',
                  borderRadius: 8,
                  py: 1,
                  px: 6,
                  my: -1,
                  mx: -6,
                  cursor: 'default',
                }}
              >
                {ens || miniAddress}
              </Text>
            </CopyToClipboard>

            {ens && (
              <CopyToClipboard textToCopy={address}>
                <Text css={{ mt: 2, fontSize: '$sm', color: slate.slate9, cursor: 'default' }}>
                  {miniAddress}
                </Text>
              </CopyToClipboard>
            )}
          </View>
          {isLoading ? (
            <LoadingIndicator size={16} />
          ) : (
            <DropdownMenu
              Trigger={
                <Button variant="slate" css={{ borderRadius: '50%', p: 1 }}>
                  <BiDotsHorizontalRounded size={20} />
                </Button>
              }
              align="end"
            >
              <DropdownMenuItem whileTap={{ scale: 0.95 }} onSelect={() => addressData.refetch()}>
                Refetch
              </DropdownMenuItem>
              <DropdownMenuItem
                whileTap={{ scale: 0.95 }}
                onSelect={onRemove}
                css={{ color: red.red9 }}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenu>
          )}
        </View>
        {!isLoading &&
          (addressWithoutTokens ? (
            hasErrored ? (
              <Text css={{ fontSize: '$sm', fontWeight: '$medium', color: '$error' }}>
                oops, something went wrong
              </Text>
            ) : (
              <Text css={{ fontSize: '$sm', fontWeight: '$medium', color: orange.orange9 }}>
                This address is empty
              </Text>
            )
          ) : (
            <View
              css={{
                mt: 3,
                display: 'grid',
                gap: 8,
                gridTemplateColumns: 'repeat(auto-fill, minmax(68px,min-content))',
              }}
            >
              {chains?.map((chain) => (
                <ChainBadge
                  key={chain}
                  chain={chain}
                  tokensCount={balances[chain]?.balances?.length}
                  tokensValueUSD={balances[chain]?.balances?.reduce?.(sumTokensBalanceUSD, 0)}
                  filtered={filter.find((c) => c === chain)}
                  onFilterOut={() => onFilterChain(chain)}
                />
              ))}
            </View>
          ))}
      </View>
    </View>
  )
}

const AddAddressDialog = dynamic(() => import('components/AddAddressDialog'))

const AddAddress = ({ onAddAddress, addresses }) => {
  const [isOpen, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <>
      <Button
        whileTap={{
          scale: 0.95,
        }}
        onTap={() => setOpen(true)}
        variant="slate"
        css={{
          borderRadius: 6,
          py: 5,
          px: 10,
        }}
      >
        Add wallet
        <BiPlus style={{ marginLeft: '4px' }} />
      </Button>
      {isOpen && (
        <AddAddressDialog
          addresses={addresses}
          onAddAddress={onAddAddress}
          isOpen={isOpen}
          onOpenChange={setOpen}
          onClose={close}
        />
      )}
    </>
  )
}

export const TrackingAddresses = ({
  addressesData,
  removeAddress,
  addAddress,
  toggleAddressChainFilter,
  addressesChainFilter,
}: {
  addressesData: UseQueryResult<AddressData, unknown>[]
  removeAddress: (address: string) => void
  addAddress: ({ address }: { address: string }) => void
  toggleAddressChainFilter: ({ address, chain }: { address: string; chain: ChainId }) => void
  addressesChainFilter: Record<string, ChainId[]>
}) => {
  const [isOpen, setIsOpen] = useState(!!addressesData[0]?.data.address)
  return (
    <View
      css={{
        flexDirection: 'column',
        // backgroundColor: slate.slate3,
        boxShadow: '0 0 15px 0 rgb(227 230 232)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 400,
      }}
      layout
    >
      <View
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 10,
          px: 15,
          borderBottom: isOpen ? `1px solid ${slate.slate4}` : 'none',
        }}
        layout
      >
        <Text
          onTap={() => setIsOpen(!isOpen)}
          css={{
            fontSize: '$md',
            fontWeight: '$bold',
            mr: '1rem',
            cursor: 'default',
            '&:hover': { opacity: 0.6 },
          }}
        >
          My Wallets
        </Text>
        <AddAddress
          onAddAddress={addAddress}
          addresses={addressesData.map((a) => a.data.address)}
        />
      </View>
      <AnimatePresence>
        {isOpen && (
          <View css={{ flexWrap: 'wrap', px: 15, py: 15, gap: 20 }}>
            {addressesData.map((addressData, i, arr) => (
              <TrackedAddress
                key={addressData.data.address}
                addressData={addressData}
                filter={addressesChainFilter[addressData.data.address]}
                onFilterChain={(chain: ChainId) =>
                  toggleAddressChainFilter({ address: addressData.data.address, chain })
                }
                onRemove={() => removeAddress(addressData.data.address)}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: (i) => ({
                    opacity: 1,
                    transition: {
                      delay: i * 0.1,
                    },
                  }),
                  hidden: {
                    opacity: 0,
                    transition: {
                      delay: (arr.length - i) * 0.05,
                    },
                  },
                }}
              />
            ))}
          </View>
        )}
      </AnimatePresence>
    </View>
  )
}
