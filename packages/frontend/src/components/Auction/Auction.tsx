import { parseEther } from '@ethersproject/units'
import { BidForm } from 'src/components/Auction/BidForm'
import { bids } from 'src/data/bids'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { BidsListSection } from '../BidsList/BidsList'

export const Auction = () => {
  return (
    <Wrapper>
      <BidForm minimumBid={parseEther('0.15')} bids={bids} />
      <BidsListSection bids={bids} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 670px;
  padding: 0 115px;
  background: ${Colors.GreyLight};
`
