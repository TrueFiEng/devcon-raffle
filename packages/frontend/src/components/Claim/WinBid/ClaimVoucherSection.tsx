import { useCallback, useState } from 'react'
import { Button } from 'src/components/Buttons'
import { ErrorNotifications } from 'src/components/Notifications/ErrorNotifications'
import { useClaimVoucher } from 'src/hooks/backend/useClaimVoucher'
import { useGetVoucher } from 'src/hooks/backend/useGetVoucher'
import { useNonce } from 'src/hooks/backend/useNonce'

import { WinOption } from './WinBidForm'

interface ClaimVoucherSectionProps {
  setVoucher: (val: string) => void
}

export const ClaimVoucherSection = ({ setVoucher }: ClaimVoucherSectionProps) => {
  const [error, setError] = useState<string>()
  const { getNonce } = useNonce(setError)
  const getVoucher = useGetVoucher()
  const claimVoucherCode = useClaimVoucher()

  const handleVoucher = useCallback(async () => {
    const authenticatedVoucher = await getVoucher()
    if (authenticatedVoucher) {
      setVoucher(authenticatedVoucher.voucherCode)
      return
    }

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
  }, [getNonce, claimVoucherCode, setVoucher, getVoucher])

  return (
    <WinOption>
      <ErrorNotifications error={error} setError={setError} onClick={handleVoucher} />
      <span>Get your voucher code now!</span>
      <Button view="primary" onClick={handleVoucher}>
        Claim voucher code
      </Button>
    </WinOption>
  )
}
