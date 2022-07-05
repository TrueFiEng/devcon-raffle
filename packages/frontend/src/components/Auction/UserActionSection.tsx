import { ReactElement } from 'react'
import { ChainIdWarning, ConnectWalletWarning } from 'src/components/Auction'
import { BidAwaiting } from 'src/components/Bid/BidAwaiting'
import { BidFlow } from 'src/components/Bid/BidFlow'
import { ClaimFlow, ClaimingClosed, ResultsAwaiting } from 'src/components/Claim'
import { FormSubHeading, FormWideWrapper } from 'src/components/Form'
import { useContractState } from 'src/hooks'
import { AuctionState, useAuctionState } from 'src/hooks/useAuctionState'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

const UserActions: Record<AuctionState, () => ReactElement> = {
  AwaitingBidding: BidAwaiting,
  WalletNotConnected: ConnectWalletWarning,
  WrongNetwork: ChainIdWarning,
  BiddingFlow: BidFlow,
  AwaitingResults: ResultsAwaiting,
  ClaimingFlow: ClaimFlow,
  ClaimingClosed: ClaimingClosed,
}

export const UserActionSection = () => {
  const state = useAuctionState()
  const { isLoading } = useContractState()
  if (isLoading) {
    return <StateLoading />
  }

  const Content = UserActions[state]
  return (
    <Wrapper>
      <Content />
    </Wrapper>
  )
}

const StateLoading = () => {
  return (
    <Wrapper>
      <FormWideWrapper>
        <FormSubHeading>Loading...</FormSubHeading>
      </FormWideWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-left: -170px;
  width: 724px;
  height: 450px;
  background-color: ${Colors.Blue};
  position: relative;
  z-index: 1;
`
