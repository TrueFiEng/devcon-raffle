import { AllBids, Header } from 'src/components/AllBids'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Bids = () => {
  return (
    <Body>
      <Header />
      <AllBids />
    </Body>
  )
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  background: ${Colors.GreyLight};
`
