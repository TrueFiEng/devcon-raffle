import { PlaceBidFlow } from 'src/components/Bid/PlaceBid/PlaceBidFlow'
import { BidsListSection } from 'src/components/BidsList/BidsList'
import { bids } from 'src/data/bids'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Auction = () => {
  return (
    <Wrapper>
      <ActionSection>
        <PlaceBidFlow />
      </ActionSection>
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
const ActionSection = styled.div`
  display: flex;
  margin-left: -170px;
  width: 724px;
  height: 450px;
  background-color: ${Colors.Blue};
  position: relative;
  z-index: 100;
`
