import { Bid } from 'src/components/Auction/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { BidsListSection } from '../BidsList/BidsList'

export const Auction = () => {
  return (
    <Wrapper>
      <Bid />
      <BidsListSection />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 670px;
  padding-left: 82px;
  background: ${Colors.Catskill};
`
