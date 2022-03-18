import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId, useEthers } from '@usedapp/core'
import { useCallback } from 'react'

interface AddEthereumChainParameter {
  chainId: string
  chainName: string
  rpcUrls: string[]
  blockExplorerUrls?: string[]
}

interface SwitchEthereumChainParameter {
  chainId: string
}

const arbitrumChainId = BigNumber.from(ChainId.Arbitrum).toHexString()
const errChainNotAddedYet = 4902

const addArbitrumChain: AddEthereumChainParameter = {
  chainId: arbitrumChainId,
  chainName: 'Arbitrum One',
  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://arbiscan.io'],
}

const switchArbitrumChain: SwitchEthereumChainParameter = {
  chainId: arbitrumChainId,
}

export function useSwitchChain() {
  const { library } = useEthers()
  return useCallback(async () => {
    if (library !== undefined) {
      await switchOrAddChain(library)
    }
  }, [library])
}

async function switchOrAddChain(library: JsonRpcProvider) {
  try {
    await library.send('wallet_switchEthereumChain', [switchArbitrumChain])
  } catch (switchChainError: any) {
    if (switchChainError.code === errChainNotAddedYet) {
      await addChain(library)
    }
  }
}

async function addChain(library: JsonRpcProvider) {
  try {
    await library.send('wallet_addEthereumChain', [addArbitrumChain])
  } catch (error: any) {
    return // error already logged by MetaMask
  }
}
