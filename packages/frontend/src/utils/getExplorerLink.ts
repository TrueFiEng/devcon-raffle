import { Arbitrum, ChainId } from '@usedapp/core'
import { getChainById } from '@usedapp/core/internal'

export function getExplorerAddressLink(chainId: ChainId, address: string) {
  const chain = getChainById(chainId) ?? Arbitrum
  return chain.getExplorerAddressLink(address)
}

export function getExplorerTxLink(chainId: ChainId, txHash: string) {
  const chain = getChainById(chainId) ?? Arbitrum
  return chain.getExplorerTransactionLink(txHash)
}
