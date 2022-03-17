import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId, useEthers } from '@usedapp/core'
import { useCallback } from 'react'

const arbitrumChainId = BigNumber.from(ChainId.Arbitrum).toHexString()
const errChainNotAddedYet = 4902

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
    await library.send('wallet_switchEthereumChain', [{ chainId: arbitrumChainId }])
  } catch (switchChainError: any) {
    if (switchChainError.code === errChainNotAddedYet) {
      await addChain(library)
    }
  }
}

async function addChain(library: JsonRpcProvider) {
  try {
    await library.send('wallet_addEthereumChain', [
      {
        chainId: arbitrumChainId,
        chainName: 'Arbitrum',
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      },
    ])
  } catch (error: any) {
    console.error(error)
  }
}
