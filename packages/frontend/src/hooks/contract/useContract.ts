import { Interface } from '@ethersproject/abi'
import { useEthers } from '@usedapp/core'
import { Contract } from 'ethers'

export function useContract(contractAddress: string, abi: string[]) {
  const { library } = useEthers()

  if (!library) {
    return undefined
  }

  return new Contract(contractAddress, new Interface(abi), library.getSigner())
}
