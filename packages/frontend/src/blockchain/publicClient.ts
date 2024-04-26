import { createPublicClient, http } from 'viem'
import { SupportedChains } from './chain'

export function getPublicClient(chainId: number) {
  const supportedChain = SupportedChains.find((chain) => chain.id === chainId)
  if (!supportedChain) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }
  return createPublicClient({
    chain: supportedChain,
    transport: http(),
  })
}
