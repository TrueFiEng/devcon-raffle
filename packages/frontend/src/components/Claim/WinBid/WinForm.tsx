import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { TxFlowSteps } from 'src/components/Auction'
import { VoucherForm, WinBidForm, WinType } from 'src/components/Claim'
import { FormWrapper } from 'src/components/Form/Form'
import { UserBid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface WinFormProps {
  userBid: UserBid
  withdrawalAmount: BigNumber
  setView: (state: TxFlowSteps) => void
}

export const WinForm = ({ userBid, withdrawalAmount, setView }: WinFormProps) => {
  const { account } = useEthers()
  const [voucher, setVoucher] = useState<string>()
  const isBidWithdrawn = userBid.claimed || userBid.winType === WinType.Auction

  useEffect(() => {
    setVoucher(undefined)
  }, [account])

  if (!voucher) {
    return (
      <Wrapper>
        <WinBidForm
          userBid={userBid}
          withdrawalAmount={withdrawalAmount}
          setView={setView}
          voucher={voucher}
          setVoucher={setVoucher}
        />
      </Wrapper>
    )
  }

  return (
    <>
      {isBidWithdrawn ? (
        <Wrapper>
          <VoucherForm voucher={voucher} withdrawnBid={isBidWithdrawn} />
        </Wrapper>
      ) : (
        <WrapperRow>
          <WinFormWrapper>
            <WinBidForm
              userBid={userBid}
              withdrawalAmount={withdrawalAmount}
              setView={setView}
              voucher={voucher}
              setVoucher={setVoucher}
            />
          </WinFormWrapper>
          <VoucherFormWrapper>
            <VoucherForm voucher={voucher} withdrawnBid={userBid.claimed} />
          </VoucherFormWrapper>
        </WrapperRow>
      )}
    </>
  )
}

const Wrapper = styled(FormWrapper)`
  justify-content: center;
`

const WrapperRow = styled.div`
  display: flex;
  width: 100%;
`
const WinFormWrapper = styled(FormWrapper)`
  justify-content: flex-start;
  padding: 72px 35px 0;
`

const VoucherFormWrapper = styled(WinFormWrapper)`
  background-color: ${Colors.BlueDark};
`
