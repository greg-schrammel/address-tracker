import { forwardRef, useEffect, useRef, useState } from 'react'
import { BiPlus, BiX } from 'react-icons/bi'

import { styled } from 'theme'
import { Text } from '@components/base/Text'
import { View } from '@components/base/View'
import { Chain, ChainId } from '@features/wallet'

import * as HoverCard from '@radix-ui/react-hover-card'
import { formatCurrency } from '@lib/numberFormat'
import { Button } from './base/Button'

const Label = styled(Text, {
  fontWeight: '$semibold',
  mr: 5,
  fontSize: '$sm',
})

export const ChainBadge = ({
  chain,
  filtered,
  onFilterOut,
  tokensCount,
  tokensValueUSD,
}: {
  chain: ChainId
  onFilterOut: () => void
  filtered: boolean
  tokensCount: number
  tokensValueUSD: number
}) => {
  const label = Chain[chain].nickname
  const color = Chain[chain].color
  const backgroundColor = filtered ? 'transparent' : Chain[chain].backgroundColor
  const borderColor = filtered ? Chain[chain].backgroundColor : 'transparent'
  return (
    <HoverCard.Root openDelay={750} closeDelay={150}>
      <HoverCard.Trigger asChild>
        <Button
          onTap={onFilterOut}
          whileTap={{ scale: 0.95 }}
          css={{
            alignItems: 'center',
            borderRadius: 6,
            pl: 8,
            pr: 4,
            py: 4,
            color,
            backgroundColor,
            border: `1px solid ${borderColor}`,
            '&:focus': { boxShadow: `0 0 0 2px ${color}` },
            '&:hover': {
              '#action': { backgroundColor: Chain[chain].backgroundColor },
            },
          }}
        >
          <Text css={{ fontWeight: '$semibold', fontSize: '$sm', color, mr: 5 }}>{label}</Text>
          <View id="action" css={{ borderRadius: '50%' }}>
            {filtered ? <BiPlus /> : <BiX />}
          </View>
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content asChild side="bottom" align="start">
        <View
          css={{
            py: 8,
            px: 12,
            borderRadius: 6,
            // borderTopLeftRadius: 2,
            flexDirection: 'column',
            background: 'white',
            mt: -4,
            ml: 4,
            boxShadow: `0px 2px 15px 0px ${Chain[chain].backgroundColor}`,
            span: {
              fontSize: '$regular',
              my: 2,
            },
          }}
        >
          <Text>
            <Label>Total Tokens:</Label>
            {tokensCount}
          </Text>
          <Text>
            <Label>Total Value:</Label>
            {formatCurrency(tokensValueUSD)}
          </Text>
        </View>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
