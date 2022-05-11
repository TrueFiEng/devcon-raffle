import Jazzicon from '@metamask/jazzicon'
import { shortenAddress, useEthers } from '@usedapp/core'
import copyToClipboard from 'copy-to-clipboard'
import { useEffect, useRef } from 'react'
import { useChainId } from 'src/hooks/chainId/useChainId'
import { Colors } from 'src/styles/colors'
import { getExplorerAddressLink } from 'src/utils/getExplorerLink'
import styled, { css } from 'styled-components'

import { Button } from '../Buttons'
import { CopyIcon } from '../Icons/CopyIcon'
import { RedirectIcon } from '../Icons/RedirectIcon'

import { ContentRow, Modal } from './Modal'

export interface AccountDetailModalProps {
  isShown: boolean | undefined
  onRequestClose: () => void
  wallet?: string
}

export const AccountDetailModal = ({ isShown, onRequestClose, wallet = 'Metamask' }: AccountDetailModalProps) => {
  const { account, deactivate } = useEthers()
  const accountIconRef = useRef<any>(null)
  const chainId = useChainId()

  useEffect(() => {
    if (account && accountIconRef.current) {
      accountIconRef.current.innerHTML = ''
      accountIconRef.current.appendChild(Jazzicon(40, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])

  return (
    <Modal isShown={isShown} onRequestClose={onRequestClose} title="Your account">
      <ContentWrapper>
        <ContentRow>
          <ConnectedWallet style={{ margin: 0 }}>Connected with {wallet}</ConnectedWallet>
        </ContentRow>
        <ContentRow>
          <AccountIcon ref={accountIconRef} />
          <AccountAddress>{shortenAddress(account || '')}</AccountAddress>
        </ContentRow>
        {account && (
          <ContentRow>
            <AccountLink
              href={account && getExplorerAddressLink(chainId, account)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RedirectIcon size={24} color={Colors.Blue} />
              View in block explorer
            </AccountLink>

            <CopyAccount onClick={() => copyToClipboard(account)}>
              <CopyIcon size={24} color={Colors.Blue} />
              Copy address
            </CopyAccount>
          </ContentRow>
        )}
      </ContentWrapper>
      <Button view="secondary" onClick={deactivate}>
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
const accountDetailsStyle = css`
  display: flex;
  column-gap: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  color: ${Colors.Blue};
  cursor: pointer;
`

const AccountLink = styled.a`
  ${accountDetailsStyle}
  text-decoration: none;
`
const CopyAccount = styled.div`
  ${accountDetailsStyle}
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
