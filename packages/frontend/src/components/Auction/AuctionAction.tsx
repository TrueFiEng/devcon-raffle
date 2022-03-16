import { useEthers } from '@usedapp/core'
import { ReactNode } from 'react'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface AuctionActionProps {
  children: ReactNode
}

export const AuctionAction = ({ children }: AuctionActionProps) => {
  const { account } = useEthers()

  return <Wrapper>{account ? <>{children}</> : <h3>Connect wallet</h3>}</Wrapper>
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
