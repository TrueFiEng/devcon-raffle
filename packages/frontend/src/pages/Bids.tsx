import { Header } from 'src/components/AllBids/Header'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Bids = () => {
  return (
    <Body>
      <Header />
      <span>test</span>
    </Body>
  )
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${Colors.GreyLight};
`
