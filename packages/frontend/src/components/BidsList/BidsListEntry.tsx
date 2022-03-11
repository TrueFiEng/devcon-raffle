import React from 'react'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import styled from 'styled-components'

import { BidsColumns } from './BidsColumns'
import { AddressColumn, BidColumn, PlaceColumn } from './BidsList'

export const BidsListEntry = () => {
  return (
    <BidsEntry>
      <BidsEntryRow>
        <PlaceColumn>12.</PlaceColumn>
        <BidColumn>10.121 ETH</BidColumn>
        <AddressColumn>{shortenEthAddress('0x6Aa2FD441be648A222da6913aa04810212b108A7')}</AddressColumn>
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
