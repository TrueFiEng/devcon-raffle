import { ReactElement } from 'react'
import { AuctionState, useAuctionState } from 'src/hooks/useAuctionState'
import styled from 'styled-components'

import { Colors } from '../../styles/colors'
import { PlaceBidFlow } from '../Bid/PlaceBid/PlaceBidFlow'

import { ChainIdWarning } from './ChainIdWarning'
import { ConnectWalletWarning } from './ConnectWalletWarning'

const UserActions: Record<AuctionState, () => ReactElement> = {
  NotConnected: ConnectWalletWarning,
  WrongNetwork: ChainIdWarning,
  BiddingFlow: PlaceBidFlow,
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
  margin-left: -170px;
  width: 724px;
  height: 450px;
  background-color: ${Colors.Blue};
  position: relative;
  z-index: 100;
`
