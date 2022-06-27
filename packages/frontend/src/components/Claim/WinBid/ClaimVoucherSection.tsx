import { useCallback, useState } from 'react'
import { Button } from 'src/components/Buttons'
import { WinOption } from 'src/components/Claim/WinBid/WinBidForm'
import { ErrorNotifications } from 'src/components/Notifications/ErrorNotifications'
import { useAuctionState } from 'src/hooks'
import { useClaimVoucher } from 'src/hooks/backend/useClaimVoucher'
import { useGetVoucher } from 'src/hooks/backend/useGetVoucher'
import { useNonce } from 'src/hooks/backend/useNonce'
import styled from 'styled-components'

import { VoucherTimeLeft } from './VoucherTimeLeft'

interface ClaimVoucherSectionProps {
  setVoucher: (val: string) => void
}

export const ClaimVoucherSection = ({ setVoucher }: ClaimVoucherSectionProps) => {
  const state = useAuctionState()
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
    <VoucherOption>
      {error && <ErrorNotifications error={error} setError={setError} onClick={handleVoucher} />}
      <Button view="primary" onClick={handleVoucher} wide>
        Claim voucher code
      </Button>
      {state !== 'ClaimingClosed' && <VoucherTimeLeft />}
    </VoucherOption>
  )
}

const VoucherOption = styled(WinOption)`
  row-gap: 16px;
`
