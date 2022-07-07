import { BackButton } from 'src/components/Buttons'
import { HeaderBar } from 'src/components/common/Header'
import { KeyIcon } from 'src/components/Icons'
import { useAuctionWinnersCount, useBids, useRaffleWinnersCount } from 'src/hooks'
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
          <NumberOfParticipants>Number of participants:</NumberOfParticipants>
          <Number>{isLoadingParams ? 0 : bids.size}</Number>
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

  @media (max-width: 1024px) {
    padding: 14px 34px;
  }
  @media (max-width: 640px) {
    padding: 8px 24px;
  }
`

const Wrapper = styled.div`
  display: flex;
  color: ${Colors.White};
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 640px) {
    gap: 8px;
  }
`

const NumberOfParticipants = styled.h2`
  font-size: 2rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`

const Key = styled.div`
  position: absolute;
  bottom: -5px;
  right: 68px;
  height: 225px;
  opacity: 0.5;
`

const Number = styled.h2`
  color: ${Colors.BlueDark};

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`
