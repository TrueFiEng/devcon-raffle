import { ChainId } from '@usedapp/core'
import { getChainPrefix } from 'src/utils/getChainPrefix'

type LinkType = 'address' | 'tx'

export function getArbiscanLink(chainId: ChainId, type: LinkType, id: string | undefined) {
  if (!id) {
    return ''
  }
  return `https://${getChainPrefix(chainId)}arbiscan.io/${type}/${id}`
}

export function getArbiscanAddressLink(address: string | undefined) {
  return `https://arbiscan.io/address/${address}`
}

export function getArbiscanTxLink(chainId: ChainId, txHash: string | undefined) {
  return getArbiscanLink(chainId, 'tx', txHash)
}
