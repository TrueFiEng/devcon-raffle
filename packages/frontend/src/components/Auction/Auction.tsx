import { Bid } from 'src/components/Auction/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Auction = () => {
  return (
    <Wrapper>
      <Bid />
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
