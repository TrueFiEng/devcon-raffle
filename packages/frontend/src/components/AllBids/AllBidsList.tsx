import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const AllBidsList = () => {
  return (
    <PageContainer>
      <TitleBanner>
        <h3>AUCTION</h3>
      </TitleBanner>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 778px;
  max-width: 778px;
  padding: 28px 0 100px;
`

const TitleBanner = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 39;
  background-color: ${Colors.BlueLight};
`
