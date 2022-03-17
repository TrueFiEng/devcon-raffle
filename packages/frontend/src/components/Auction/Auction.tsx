import { BidsListSection } from 'src/components/BidsList/BidsList'
import { bids } from 'src/data/bids'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { ActionSection } from './ActionSection'

export const Auction = () => {
  return (
    <Wrapper>
      <ActionSection />
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
