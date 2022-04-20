import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId, useEthers } from '@usedapp/core'
import { useCallback } from 'react'
import { ADDRESSES } from 'src/config/addresses'
import { CONFIG } from 'src/config/config'
import { SupportedChainId } from 'src/constants/chainIDs'

import { useChainId } from '../chainId/useChainId'

export function useClaimVoucher() {
  const { account, library } = useEthers()
  const chainId = useChainId()
  return useCallback(
    async (nonce: string) => {
      if (library && account) {
        const signature = await signClaimVoucher(library, account, chainId, nonce)
        if (!signature) {
          return { error: 'Could not sign message.' }
        }
        return await fetchVoucherCode(account, nonce, signature)
      }
    },
    [library, account, chainId]
  )
}

async function signClaimVoucher(
  library: JsonRpcProvider,
  account: string,
  chainId: SupportedChainId,
  nonce: string
): Promise<string | undefined> {
  const data = getMessage(account, nonce, ADDRESSES['devcon'][chainId], chainId)
  try {
    return await library.send('eth_signTypedData', [data, account])
  } catch {
    return undefined // error already logged by MetaMask
  }
}

async function fetchVoucherCode(userAddress: string, nonce: string, signature: string): Promise<VoucherCodeResponse> {
  const response = await fetch(CONFIG.backendUrl + '/voucher-codes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ signature, nonce, userAddress }),
  })
  if ([200, 403].includes(response.status)) {
    return await response.json()
  }
  return {
    error: `Server returned a ${response.status} code.`,
  }
}

type VoucherCodeResponse = { voucherCode: string } | { error: string }

const getMessage = (signer: string, nonce: string, devcon6Address: string, chainId: ChainId) => [
  {
    name: 'Message',
    type: 'string',
    value: `Claim voucher code for address ${signer}.`,
  },
  {
    name: 'Devcon6 contract',
    type: 'address',
    value: devcon6Address,
  },
  {
    name: 'Chain ID',
    type: 'uint256',
    value: chainId,
  },
  {
    name: 'Signature nonce',
    type: 'string',
    value: nonce,
  },
]
