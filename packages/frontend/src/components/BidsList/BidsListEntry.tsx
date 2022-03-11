import { BigNumber } from '@ethersproject/bignumber'
import React from 'react'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import styled from 'styled-components'
import { AddressColumn, BidColumn, BidsColumns, PlaceColumn } from './BidsColumns'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'

interface Props {
  place: number
  bid: BigNumber
  address: string
}

export const BidsListEntry = ({ place, bid, address }: Props) => {
  return (
    <BidsEntry>
      <BidsEntryRow>
        <PlaceColumn>
          <CellText>{place}.</CellText>
        </PlaceColumn>
        <BidColumn>
          <CellText>{formatEtherAmount(bid)} ETH</CellText>
        </BidColumn>
        <AddressColumn>
          <AddressLink href={'https://etherscan.io/address/' + address} target="_blank">
            {shortenEthAddress(address)}
          </AddressLink>
        </AddressColumn>
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

const CellText = styled.span`
  font-family: 'Space Mono', 'Roboto Mono', monospace;
  line-height: 26px;
`

const AddressLink = styled.a`
  font-family: 'Space Mono', 'Roboto Mono', monospace;
`
