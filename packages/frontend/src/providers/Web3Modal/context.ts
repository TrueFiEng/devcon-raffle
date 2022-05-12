import { createContext } from 'react'
import Web3Modal from 'web3modal'

export interface Web3ModalContext {
  web3Modal: Web3Modal
}

export const Web3ModalContext = createContext<Web3ModalContext>({
  web3Modal: new Web3Modal(), // TODO redo
})
