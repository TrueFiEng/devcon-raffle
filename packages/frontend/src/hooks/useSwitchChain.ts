import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, useEthers } from '@usedapp/core'
import { useCallback } from 'react'

const arbitrumChainId = BigNumber.from(ChainId.Arbitrum).toHexString()

export function useSwitchChain() {
  const { library } = useEthers()
  return useCallback(async () => {
    try {
      await library?.send('wallet_switchEthereumChain', [{ chainId: arbitrumChainId }])
    } catch (switchChainError: any) {
      if (switchChainError.code === 4902) {
        try {
          await library?.send('wallet_addEthereumChain', [
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
    }
  }, [library])
}
