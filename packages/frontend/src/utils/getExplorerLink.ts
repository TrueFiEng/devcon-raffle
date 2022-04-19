import { Arbitrum, ChainId } from '@usedapp/core'
import { getChainById } from '@usedapp/core/internal'

export function getExplorerAddressLink(chainId: ChainId, address: string) {
  const chain = getChain(chainId)
  return chain.getExplorerAddressLink(address)
}

export function getExplorerTxLink(chainId: ChainId, txHash: string) {
  const chain = getChain(chainId)
  return chain.getExplorerTransactionLink(txHash)
}

function getChain(chainId: ChainId) {
  return getChainById(chainId) ?? Arbitrum
}
