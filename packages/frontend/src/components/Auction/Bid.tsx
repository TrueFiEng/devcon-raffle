import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Bid = () => {
  return <Wrapper>Place bid</Wrapper>
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: -135px;
  position: relative;
  z-index: 100;
  width: 724px;
  height: 450px;
  background-color: ${Colors.Blue};
  border-radius: 0px 0px 0px 99px;
`
