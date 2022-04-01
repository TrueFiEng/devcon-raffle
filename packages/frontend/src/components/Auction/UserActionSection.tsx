import { ReactElement } from 'react'
import { AuctionState, useAuctionState } from 'src/hooks/useAuctionState'
import styled from 'styled-components'

import { Colors } from '../../styles/colors'
import { BidAwaiting } from '../Bid/BidAwaiting'
import { BidFlow } from '../Bid/BidFlow'

import { ChainIdWarning } from './ChainIdWarning'
import { ConnectWalletWarning } from './ConnectWalletWarning'

const UserActions: Record<AuctionState, () => ReactElement> = {
  Awaiting: BidAwaiting,
  NotConnected: ConnectWalletWarning,
  WrongNetwork: ChainIdWarning,
  BiddingFlow: BidFlow,
}

export const UserActionSection = () => {
  const state = useAuctionState()

  const Content = UserActions[state]
  return (
    <Wrapper>
      <Content />
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
  z-index: 100;
`
