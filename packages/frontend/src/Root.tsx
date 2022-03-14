import { Auction } from 'src/components/Auction/Auction'
import { Info } from 'src/components/Info/Info'
import styled from 'styled-components'

import { TopBar } from './components/TopBar/TopBar'

export function Root() {
  return (
    <RootContainer>
      <TopBar />
      <PageContainer>
        <Info />
        <Auction />
      </PageContainer>
    </RootContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const RootContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`
