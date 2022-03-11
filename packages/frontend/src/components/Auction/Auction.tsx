import { BigNumber } from '@ethersproject/bignumber'
import { Bid } from 'src/components/Auction/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { BidsListSection } from '../BidsList/BidsList'

import { bids } from './data'

export interface Bid {
  bidderAddress: string
  amount: BigNumber
}

export const Auction = () => {
  return (
    <Wrapper>
      <Bid />
      <BidsListSection bids={bids} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 670px;
  padding-left: 82px;
  background: ${Colors.GreyLight};
`
