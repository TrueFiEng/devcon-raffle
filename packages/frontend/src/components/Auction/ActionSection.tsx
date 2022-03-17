import { ReactElement } from 'react'
import { AuctionStatus, useAuctionStatus } from 'src/hooks/useAuctionStatus'
import styled from 'styled-components'

import { Colors } from '../../styles/colors'
import { PlaceBidFlow } from '../Bid/PlaceBid/PlaceBidFlow'

import { ChainIdWarning } from './ChainIdWarning'
import { ConnectWalletWarning } from './ConnectWalletWarning'

const Actions: Record<AuctionStatus, () => ReactElement> = {
  NotConnected: ConnectWalletWarning,
  WrongNetwork: ChainIdWarning,
  Connected: PlaceBidFlow,
}

export const ActionSection = () => {
  const status = useAuctionStatus()

  const Content = Actions[status]
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
