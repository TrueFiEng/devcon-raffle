import Jazzicon from '@metamask/jazzicon'
import { shortenAddress, useEthers } from '@usedapp/core'
import { useCallback, useEffect, useRef } from 'react'
import { CopyButton, RedirectButton } from 'src/components/Buttons'
import { Button } from 'src/components/Buttons/Button'
import { ContentRow, Modal } from 'src/components/Modal/Modal'
import { useChainId } from 'src/hooks/chainId/useChainId'
import { Colors } from 'src/styles/colors'
import { getExplorerAddressLink } from 'src/utils/getExplorerLink'
import styled from 'styled-components'

export interface ModalProps {
  isShown: boolean | undefined
  onRequestClose: () => void
  wallet?: string
}

export const AccountDetailModal = ({ isShown, onRequestClose, wallet = 'Metamask' }: ModalProps) => {
  const { account, deactivate } = useEthers()
  const accountIconRef = useRef<any>(null)
  const chainId = useChainId()

  useEffect(() => {
    if (account && accountIconRef.current) {
      accountIconRef.current.innerHTML = ''
      accountIconRef.current.appendChild(Jazzicon(40, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  const onDisconnect = useCallback(() => {
    onRequestClose()
    deactivate()
  }, [onRequestClose, deactivate])

  return (
    <Modal isShown={isShown} onRequestClose={onRequestClose} title="Your account">
      <ContentWrapper>
        <ContentRow>
          <ConnectedWallet>Connected with {wallet}</ConnectedWallet>
        </ContentRow>
        <ContentRow>
          <AccountIcon ref={accountIconRef} />
          <AccountAddress>{shortenAddress(account || '')}</AccountAddress>
        </ContentRow>
        {account && (
          <ContentRow>
            <RedirectButton
              link={account && getExplorerAddressLink(chainId, account)}
              tooltip="View on Arbiscan"
              color={Colors.Blue}
              label=" View in block explorer"
              side="top"
            />

            <CopyButton value={account} text="Copy account address" color={Colors.Blue} label="Copy address" side="top"/>
          </ContentRow>
        )}
      </ContentWrapper>
      <Button view="secondary" onClick={onDisconnect}>
        Disconnect
      </Button>
    </Modal>
  )
}

const AccountIcon = styled.div`
  display: flex;
  place-items: center;
  height: 40px;
  width: 40px;
  background-color: ${Colors.Blue};
  border-radius: 50%;
`

const AccountAddress = styled.p`
  font-family: 'Space Mono', 'Roboto Mono', monospace;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.Black};
`

const ConnectedWallet = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  color: ${Colors.Grey};
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 20px;
  padding: 20px;
  border: 1px solid #e7eaf3;
`
