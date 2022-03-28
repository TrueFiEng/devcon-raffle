import { BigNumber } from '@ethersproject/bignumber'
import React from 'react'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import { shortenEthAddress } from 'src/utils/formatters/shortenEthAddress'
import { getArbiscanAddressLink } from 'src/utils/getArbiscanLink'
import styled from 'styled-components'

import { Colors } from '../../styles/colors'

import { AddressColumn, BidColumn, BidsColumns, PlaceColumn } from './BidsColumns'

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
        <BidColumn>{formatEtherAmount(bid)} ETH</BidColumn>
        <AddressColumn>
          <AddressLink href={getArbiscanAddressLink(address)} target="_blank" rel="noopener noreferrer">
            {shortenEthAddress(address)}
          </AddressLink>
        </AddressColumn>
      </BidsEntryRow>
    </BidsEntry>
  )
}

const BidsEntry = styled.li`
  &:not(:last-child) {
    margin-bottom: 32px;
  }
`
const BidsEntryRow = styled.div`
  ${BidsColumns};
`

const AddressLink = styled.a`
  color: ${Colors.Blue};
`
