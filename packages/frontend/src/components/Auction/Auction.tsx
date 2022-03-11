import { Bid } from 'src/components/Auction/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { Button } from '../Buttons/Button'

export const Auction = () => {
  return (
    <Wrapper>
      <Bid />
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
