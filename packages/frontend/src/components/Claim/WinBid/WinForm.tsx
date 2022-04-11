import { BigNumber } from '@ethersproject/bignumber'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { VoucherForm } from 'src/components/Claim/WinBid/VoucherForm'
import { WinBidForm } from 'src/components/Claim/WinBid/WinBidForm'
import { FormWrapper } from 'src/components/Form/Form'
import { SettledBid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface WinFormProps {
  userBid: SettledBid
  withdrawalAmount: BigNumber
  setView: (state: TxFlowSteps) => void
  voucher: boolean
  setVoucher: (val: boolean) => void
}

export const WinForm = ({ userBid, withdrawalAmount, setView, voucher, setVoucher }: WinFormProps) => {
  return (
    <>
      {voucher ? (
        userBid.claimed ? (
          <Wrapper>
            <VoucherForm voucher="0xD69bcE4E8D0929E16" withdrawnBid={userBid.claimed} />{' '}
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
              <VoucherForm voucher="0xD69bcE4E8D0929E16" withdrawnBid={userBid.claimed} />
            </VoucherFormWrapper>
          </WrapperRow>
        )
      ) : (
        <Wrapper>
          <WinBidForm
            userBid={userBid}
            withdrawalAmount={withdrawalAmount}
            setView={setView}
            voucher={voucher}
            setVoucher={setVoucher}
          />
        </Wrapper>
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
  justify-content: center;
  padding: 0 35px;
`

const VoucherFormWrapper = styled(WinFormWrapper)`
  background-color: ${Colors.BlueDark};
`
