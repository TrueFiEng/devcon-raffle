import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode, useCallback } from 'react'
import { hexOpacity, Colors } from 'src/styles/colors'
import styled from 'styled-components'

import { CloseButton } from '../Buttons/CloseButton'

export interface ModalProps {
  isShown: boolean | undefined
  onRequestClose: () => void
  children: ReactNode
  title?: string
}

export const Modal = ({ isShown, onRequestClose, children, title }: ModalProps) => {
  const closeModal = useCallback(() => isShown && onRequestClose(), [isShown, onRequestClose])

  return (
    <Dialog.Root open={isShown}>
      <Dialog.Portal>
        <Overlay>
          <Content>
            <Header>
              <Dialog.Title>{title}</Dialog.Title>
              <CloseButton size={24} color={Colors.White} onClick={closeModal} />
            </Header>
            {children}
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const Overlay = styled(Dialog.Overlay)`
  background-color: ${hexOpacity(Colors.Blue, 0.8)};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: hidden;
`

const Content = styled(Dialog.Content)`
  width: 383px;
  background-color: ${Colors.White};
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 68px;
  padding: 16px 24px;
  overflow: hidden;
`
