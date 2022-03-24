import { BidsListSection } from 'src/components/BidsList/BidsList'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { UserActionSection } from './UserActionSection'

export const Auction = () => {
  return (
    <Wrapper>
      <UserActionSection />
      <BidsListSection />
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
