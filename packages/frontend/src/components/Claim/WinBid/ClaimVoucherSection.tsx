import * as ToastPrimitive from '@radix-ui/react-toast'
import { useCallback, useState } from 'react'
import { Button } from 'src/components/Buttons'
import { NotificationsList } from 'src/components/Notifications/Notifications'
import { NotificationToast } from 'src/components/Notifications/NotificationToast'
import { useClaimVoucher } from 'src/hooks/backend/useClaimVoucher'
import { useNonce } from 'src/hooks/backend/useNonce'

import { WinOption } from './WinBidForm'

interface ClaimVoucherSectionProps {
  setVoucher: (val: string) => void
}

export const ClaimVoucherSection = ({ setVoucher }: ClaimVoucherSectionProps) => {
  const [error, setError] = useState<string>()
  const { getNonce } = useNonce(setError)
  const claimVoucherCode = useClaimVoucher()

  const handleVoucher = useCallback(async () => {
    const nonce = await getNonce()
    if (!nonce) {
      return
    }

    const voucherResponse = await claimVoucherCode(nonce)
    if (!voucherResponse) {
      return
    }

    if ('error' in voucherResponse) {
      setError(voucherResponse.error)
    } else {
      setError(undefined)
      setVoucher(voucherResponse.voucherCode)
    }
  }, [getNonce, claimVoucherCode, setVoucher])

  return (
    <WinOption>
      {error && (
        <ToastPrimitive.Provider>
          <NotificationToast
            notification={{
              id: error,
              type: 'transactionSignError',
              submittedAt: 1,
              message: error,
              transactionName: 'Get voucher code',
            }}
          />{' '}
          <NotificationsList />
        </ToastPrimitive.Provider>
      )}
      <Button view="primary" onClick={handleVoucher}>
        Get voucher code
      </Button>
    </WinOption>
  )
}
