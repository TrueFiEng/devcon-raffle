import { Auction } from 'src/components/Auction'
import { Info } from 'src/components/Info'
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
