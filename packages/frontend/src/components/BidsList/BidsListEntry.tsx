import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'
import React from 'react'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import styled from 'styled-components'

import { BidsColumns } from './BidsColumns'
import { AddressColumn, BidColumn, PlaceColumn } from './BidsList'
interface Props {
  place: number
  bid: BigNumber
  address: string
}

export const BidsListEntry = ({ place, bid, address }: Props) => {
  return (
    <BidsEntry>
      <BidsEntryRow>
        <PlaceColumn>{place}.</PlaceColumn>
        <BidColumn>{utils.formatEther(bid)} ETH</BidColumn>
        <AddressColumn>{shortenEthAddress(address)}</AddressColumn>
      </BidsEntryRow>
    </BidsEntry>
  )
}

const BidsEntry = styled.li`
  margin: 0 0 32px 0;
`

const BidsEntryRow = styled.div`
  ${BidsColumns}
  font-family: 'Space Mono', 'Roboto Mono', monospace;
`
