import { useState } from 'react'
import { BiPlus, BiSearch } from 'react-icons/bi'

import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { Button } from '@components/base/Button'
import { LoadingIndicator } from '@components/base/LoadingIndicator'
import { Chains } from '@features/wallet'
import { AddressInputContainer, SuggestionsCombobox, useAddressInput } from './SearchAddressInput'
import { Dialog } from './base/Dialog'
import { toOxfordComma } from '@lib/textFormat'

export const AddAddressDialog = ({ onAddAddress, addresses, isOpen, onOpenChange, onClose }) => {
  const { suggestions, onChange, error, isLoading, verifyAndSubmitAddress } = useAddressInput(
    ({ address }) => {
      onAddAddress({ address })
      close()
    },
    addresses,
  )
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onPointerDownOutside={onClose}
      onEscapeKeyDown={onClose}
      title="Add address to track"
      description={`Supported chains are ${toOxfordComma(
        Chains.map((chain) => chain.displayFullName),
      )}`}
      ConfirmButton={
        <Button onTap={verifyAndSubmitAddress} variant="black" css={{ fontWeight: '$bold' }}>
          Add Address
        </Button>
      }
    >
      <View css={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <AddressInputContainer>
          <SuggestionsCombobox
            onChange={onChange}
            onEnter={verifyAndSubmitAddress}
            onSelectSuggestion={verifyAndSubmitAddress}
            suggestions={suggestions}
            placeholder="Search any Address or ENS"
          />
          {isLoading ? <LoadingIndicator size={18} /> : <BiSearch size={18} />}
        </AddressInputContainer>
        {error && (
          <Text css={{ fontSize: '$sm', fontWeight: '$semibold', color: '$error', mt: '0.5rem' }}>
            {error}
          </Text>
        )}
      </View>
    </Dialog>
  )
}

export default AddAddressDialog
