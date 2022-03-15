import { useEthers } from '@usedapp/core'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { Colors } from 'src/styles/colors'

interface AuctionActionProps {
  children: ReactNode
}

export const AuctionAction = ({ children }: AuctionActionProps) => {
  const { account } = useEthers()

  return <Wrapper>{account ? <h3>Connect wallet</h3> : <>{children}</>}</Wrapper>
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
