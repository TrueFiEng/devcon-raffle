import { useContext } from 'react'
import { Web3ModalContext } from 'src/providers/Web3Modal/context'

export const useWeb3Modal = () => {
  const { web3Modal } = useContext(Web3ModalContext)
  return web3Modal
}
