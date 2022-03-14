import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { BidForm } from 'src/components/Auction/BidForm'
import { bidList } from 'src/data/bids'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { BidsListSection } from '../BidsList/BidsList'
import { Button } from '../Buttons/Button'

import { bids } from './data'

export interface Bid {
  bidderAddress: string
  amount: BigNumber
}

export const Auction = () => {
  return (
    <Wrapper>
      <BidForm minimumBid={parseEther('0.15')} bidList={bidList} />
      <BidsListSection bids={bids} />
      <Button view="secondary">Show all</Button>
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
