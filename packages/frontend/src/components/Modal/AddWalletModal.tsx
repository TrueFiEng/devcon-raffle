import styled from 'styled-components'

import { Modal } from './Modal'

export interface ModalProps {
  isShown: boolean | undefined
  onRequestClose: () => void
}

export const AddWalletModal = ({ isShown, onRequestClose }: ModalProps) => {
  return (
    <Modal isShown={isShown} onRequestClose={onRequestClose}>
      <Wrapper>
        <Text>Hi! we noticed you don't have a wallet yet.</Text>
      </Wrapper>
    </Modal>
  )
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 16px;
  padding: 16px;
`

const Text = styled.p`
  font-family: 'Space Mono', 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
`
