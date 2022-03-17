import { ReactElement } from 'react'
import { AuctionStatus, useAuctionStatus } from 'src/hooks/useAuctionStatus'
import styled from 'styled-components'

import { Colors } from '../../styles/colors'
import { PlaceBidFlow } from '../Bid/PlaceBid/PlaceBidFlow'

import { ChainIdWarning } from './ChainIdWarning'
import { ConnectWalletWarning } from './ConnectWalletWarning'

export const BidFormSection = () => {
  const status = useAuctionStatus()
  const Content = Actions[status]

  return (
    <ActionSection>
      <Content />
    </ActionSection>
  )
}

const Actions: Record<AuctionStatus, () => ReactElement> = {
  WrongNetwork: ChainIdWarning,
  NotConnected: ConnectWalletWarning,
  Connected: PlaceBidFlow,
}

const ActionSection = styled.div`
  display: flex;
  margin-left: -170px;
  width: 724px;
  height: 450px;
  background-color: ${Colors.Blue};
  position: relative;
  z-index: 100;
`
