import { useCallback, useState } from 'react'
import { Button } from 'src/components/Buttons'
import { ErrorNotifications } from 'src/components/Notifications/ErrorNotifications'
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
      <ErrorNotifications error={error} setError={setError} />
      <Button view="primary" onClick={handleVoucher}>
        Get voucher code
      </Button>
    </WinOption>
  )
}
