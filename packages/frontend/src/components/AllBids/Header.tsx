import { BackButton } from 'src/components/Buttons/BackButton'
import { HeaderBar } from 'src/components/common/Header'
import { KeyIcon } from 'src/components/Icons/KeyIcon'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useBids } from 'src/hooks/useBids'
import { useRaffleWinnersCount } from 'src/hooks/useRaffleWinnersCount'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const Header = () => {
  const auctionWinnersCount = useAuctionWinnersCount()
  const raffleWinnersCount = useRaffleWinnersCount()
  const isLoadingParams = auctionWinnersCount === undefined || raffleWinnersCount === undefined

  const { bids } = useBids()
  return (
    <StyledHeader>
      <BackButton url="/" />
      <Wrapper>
        <Title>
          <h2>Number of participants:</h2>
          <Number>{isLoadingParams ? 0 : bids.length}</Number>
        </Title>
      </Wrapper>
      <Key>
        <KeyIcon />
      </Key>
    </StyledHeader>
  )
}

const StyledHeader = styled(HeaderBar)`
  height: 160px;
  padding: 28px 68px;
  overflow: hidden;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: ${Colors.White};
`

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
`

const Key = styled.div`
  position: absolute;
  bottom: -5px;
  right: 68px;
  height: 225px;
`

const Number = styled.h2`
  color: ${Colors.BlueDark};
`
