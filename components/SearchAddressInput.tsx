import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { debounce } from 'debounce'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'

import { styled } from '@theme'
import { View } from '@components/base/View'
import { Input } from '@components/base/Input'
import { useOnClickOutside } from '@components/hooks/useOnClickOutside'
import { fetchENSSuggestions } from '@lib/ens'
import { isSupportedAddress } from '@lib/validateAddress'
import { slate } from '@radix-ui/colors'
import { validate } from 'trezor-address-validator'

export const AddressInputContainer = styled(View, {
  background: 'white',
  width: '100%',
  maxWidth: 450,
  m: 0,
  alignItems: 'center',
  pr: 15,
  border: 'solid 1px white',
  backgroundColor: slate.slate3,
  '&:focus-within': {
    border: `solid 1px ${slate.slate4}`,
  },
  input: {
    background: 'transparent',
    fontSize: '$regular',
  },
  variants: {
    variant: {
      large: {
        borderRadius: 16,
        input: {
          fontSize: '$md',
          borderRadius: 16,
        },
      },
      default: {
        borderRadius: 12,
        input: {
          borderRadius: 12,
          fontWeight: '$regular',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const isKeyEnter = (e) => e.key === 'Enter'

export const SuggestionsCombobox = ({ onSelectSuggestion, suggestions, onEnter, ...props }) => {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(suggestions?.length > 1)
  }, [suggestions])
  useOnClickOutside(ref, () => setOpen(false))
  return (
    <Combobox
      ref={ref}
      as={View}
      onSelect={onSelectSuggestion}
      aria-label="search"
      css={{ width: '100%', position: 'relative' }}
    >
      <ComboboxInput
        as={Input}
        selectOnClick
        css={{ p: 8 }}
        onKeyUp={(e) => isKeyEnter(e) && onEnter()}
        {...props}
      />
      {open && (
        <ComboboxPopover
          portal={false}
          style={{ display: 'flex', position: 'absolute', top: '80%' }}
        >
          <View
            css={{
              background: '#ffffffcf',
              backdropFilter: 'blur(4px)',
              borderRadius: 12,
              boxShadow: '0px 2px 20px 0px #c1c1e049',
              color: '$mediumContrast',
            }}
          >
            <ComboboxList as={View} css={{ flexDirection: 'column', m: 0, p: 5 }}>
              {suggestions?.map(({ ens }) => (
                <ComboboxOption
                  as={View}
                  key={ens}
                  value={ens}
                  css={{
                    p: 12,
                    my: 2,
                    borderRadius: 10,
                    cursor: 'default',
                    fontWeight: '$semibold',
                    '&[data-highlighted]': {
                      color: '$highContrast',
                      backgroundColor: slate.slate2,
                    },
                    '[data-user-value="true"]': {
                      color: '$highContrast',
                    },
                    '&:hover': {
                      color: '$highContrast',
                      backgroundColor: slate.slate2,
                    },
                  }}
                />
              ))}
            </ComboboxList>
          </View>
        </ComboboxPopover>
      )}
    </Combobox>
  )
}

const invalidAddressErrorMsg = (address: string) =>
  validate(address, 'Binance')
    ? 'Addresses starting with bnb are Binance chain we only support Binance Smart chain'
    : 'Invalid wallet address'

export const useAddressInput = (onSubmit, addresses = []) => {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: suggestions } = useQuery(['ens-suggestions', searchQuery], () =>
    fetchENSSuggestions(searchQuery),
  )
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const clearError = () => setError(null)

  const onChangeDebounced = debounce((e) => {
    clearError()
    setSearchQuery(e.target.value)
  }, 300)

  const onChange = (e) => {
    setInputValue(e.target.value)
    onChangeDebounced(e)
  }
  const debouncedOnChange = useMemo(() => onChange, [])
  useEffect(() => () => onChangeDebounced.clear())

  const verifyAndSubmitAddress = async (selectedSuggestion = undefined) => {
    let address = selectedSuggestion
    if (typeof selectedSuggestion !== 'string') {
      if (!inputValue) return
      setLoading(true)
      // if it wasn't a selected suggestion use the actual input value,
      // searchQuery is debounce and can be outdated when user types fast
      address = inputValue
    }
    if (addresses.find((a) => a === address)) return setError('Address already added')
    if (isSupportedAddress(address)) return onSubmit({ address })
    else {
      setLoading(true)
      const resolvedENS = await import('lib/ens').then((ens) => ens.resolve(address))
      if (resolvedENS) return onSubmit({ address: resolvedENS })
      setLoading(false)
      if (addresses.find((a) => a === resolvedENS)) return setError('Address already added')
      return setError(invalidAddressErrorMsg(address))
    }
  }

  return {
    searchQuery,
    suggestions,
    onChange: debouncedOnChange,
    error,
    isLoading,
    verifyAndSubmitAddress,
  }
}
