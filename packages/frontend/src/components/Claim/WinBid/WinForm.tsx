import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { VoucherForm } from 'src/components/Claim/WinBid/VoucherForm'
import { WinBidForm } from 'src/components/Claim/WinBid/WinBidForm'
import { WinType } from 'src/components/Claim/WinBid/WinFlowEnum'
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
  const [voucher, setVoucher] = useState<string>()
  const withdrawnBid = userBid.claimed || userBid.winType === WinType.Auction

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
      {withdrawnBid ? (
        <VoucherWrapper>
          <VoucherForm voucher={voucher} withdrawnBid={withdrawnBid} />
        </VoucherWrapper>
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

const VoucherWrapper = styled(Wrapper)`
  padding: 0 200px;
`

const WrapperRow = styled.div`
  display: flex;
  width: 100%;
`
const WinFormWrapper = styled(FormWrapper)`
  justify-content: flex-end;
  padding: 0 35px 127px;
`

const VoucherFormWrapper = styled(WinFormWrapper)`
  background-color: ${Colors.BlueDark};
`
