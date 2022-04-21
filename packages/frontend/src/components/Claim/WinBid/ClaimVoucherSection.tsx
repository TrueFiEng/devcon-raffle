import { useCallback, useState } from 'react'
import { Button } from 'src/components/Buttons'
import { useClaimVoucher } from 'src/hooks/backend/useClaimVoucher'
import { useGetVoucher } from 'src/hooks/backend/useGetVoucher'
import { useNonce } from 'src/hooks/backend/useNonce'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

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
      {!error ? <span>Claim your voucher code now!</span> : <ErrorText>{error}</ErrorText>}
      <Button view="primary" onClick={handleVoucher}>
        Get voucher code
      </Button>
    </WinOption>
  )
}

const ErrorText = styled.span`
  color: ${Colors.Red};
`
