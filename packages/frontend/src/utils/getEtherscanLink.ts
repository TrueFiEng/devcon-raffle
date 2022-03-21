import { ChainId } from '@usedapp/core'
import { getEtherscanChainPrefix } from 'src/utils/getEtherscanChainPrefix'

type LinkType = 'address' | 'tx'

export function getEtherscanLink(chainId: ChainId, type: LinkType, id: string | undefined) {
  if (!id) {
    return ''
  }
  return `https://${getEtherscanChainPrefix(chainId)}etherscan.io/${type}/${id}`
}

export function getEtherscanAddressLink(chainId: ChainId, address: string | undefined) {
  return getEtherscanLink(chainId, 'address', address)
}

export function getEtherscanTxLink(chainId: ChainId, txHash: string | undefined) {
  return getEtherscanLink(chainId, 'tx', txHash)
}
