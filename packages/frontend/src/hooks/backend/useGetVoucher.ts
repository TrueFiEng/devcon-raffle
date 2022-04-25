import { useEthers } from '@usedapp/core'
import { useCallback } from 'react'
import { CONFIG } from 'src/config/config'

export function useGetVoucher() {
  const { account } = useEthers()
  return useCallback(async () => fetchVoucherCode(account ?? undefined), [account])
}

async function fetchVoucherCode(address?: string): Promise<{ voucherCode: string } | undefined> {
  const response = await fetch(CONFIG.backendUrl + '/voucher-codes' + getAddressQuery(address), {
    method: 'GET',
    credentials: 'include',
  })
  if (response.status === 200) {
    const body = await response.json()
    if ('voucherCode' in body) {
      return body
    }
  }
}

const getAddressQuery = (address?: string) => (address ? `?userAddress=${address}` : '')
