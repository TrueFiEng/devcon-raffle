import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId, useEthers } from '@usedapp/core'
import { useCallback } from 'react'

import { SupportedChainId } from '../constants/chainIDs'

import { useChainId } from './chainId/useChainId'

interface AddEthereumChainParameter {
  chainId: string
  chainName: string
  rpcUrls: string[]
  blockExplorerUrls?: string[]
}

interface SwitchEthereumChainParameter {
  chainId: string
}

const toHex = (value: number) => BigNumber.from(value).toHexString()
const arbitrumChainId = toHex(ChainId.Arbitrum)
const errChainNotAddedYet = 4902

const addArbitrumChain: AddEthereumChainParameter = {
  chainId: arbitrumChainId,
  chainName: 'Arbitrum One',
  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://arbiscan.io'],
}
const getSwitchChainParam = (chainId: SupportedChainId): SwitchEthereumChainParameter => ({ chainId: toHex(chainId) })

export function useSwitchChain() {
  const { library } = useEthers()
  const chainId = useChainId()

  return useCallback(async () => {
    if (library !== undefined) {
      await switchOrAddChain(library, chainId)
    }
  }, [library, chainId])
}

async function switchOrAddChain(library: JsonRpcProvider, chainId: SupportedChainId) {
  try {
    await library.send('wallet_switchEthereumChain', [getSwitchChainParam(chainId)])
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
