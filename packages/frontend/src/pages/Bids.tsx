import { AllBidsList } from 'src/components/AllBids/AllBidsList'
import { Header } from 'src/components/AllBids/Header'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Bids = () => {
  return (
    <Body>
      <Header />
      <AllBidsList />
    </Body>
  )
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${Colors.GreyLight};
`
