import React from 'react'
import styled from 'styled-components'

import { AddressColumn, BidColumn, BidsColumns, PlaceColumn } from './BidsList'

export const BidsListEntry = () => {
  return (
    <BidsEntry>
      <BidsEntryRow>
        <PlaceColumn>12.</PlaceColumn>
        <BidColumn>10.121 ETH</BidColumn>
        <AddressColumn>0xAAAAAA</AddressColumn>
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
