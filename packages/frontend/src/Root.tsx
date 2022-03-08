import { Auction } from 'src/components/Auction/Auction'
import { Info } from 'src/components/Info/Info'
import styled from 'styled-components'

export function Root() {
  return (
    <RootContainer>
      <Info />
      <Auction />
    </RootContainer>
  )
}

const RootContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
