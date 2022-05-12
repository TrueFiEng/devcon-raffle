import { Auction } from 'src/components/Auction'
import { Info } from 'src/components/Info/Info'
import styled from 'styled-components'

export function Home() {
  return (
    <PageContainer>
      <Info />
      <Auction />
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`
