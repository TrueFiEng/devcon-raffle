import { BigNumber } from '@ethersproject/bignumber'
import { TxFlowSteps } from 'src/components/Auction/TxFlowSteps'
import { VoucherForm } from 'src/components/Claim/WinBid/VoucherForm'
import { WinBidForm } from 'src/components/Claim/WinBid/WinBidForm'
import { WinOptions } from 'src/components/Claim/WinBid/WinFlowEnum'
import { FormWrapper } from 'src/components/Form/Form'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface WinFormProps {
  win: WinOptions
  bid: BigNumber
  setView: (state: TxFlowSteps) => void
  withdrawnBid: boolean
  setWithdrawnBid: (val: boolean) => void
  voucher: boolean
  setVoucher: (val: boolean) => void
}

export const WinForm = ({ win, bid, setView, withdrawnBid, setWithdrawnBid, voucher, setVoucher }: WinFormProps) => {
  return (
    <>
      {voucher ? (
        withdrawnBid ? (
          <Wrapper>
            <VoucherForm voucher="0xD69bcE4E8D0929E16" withdrawnBid={withdrawnBid} />{' '}
          </Wrapper>
        ) : (
          <WrapperRow>
            <WinFormWrapper>
              <WinBidForm
                bid={bid}
                setView={setView}
                win={win}
                withdrawnBid={withdrawnBid}
                setWithdrawnBid={setWithdrawnBid}
                voucher={voucher}
                setVoucher={setVoucher}
              />
            </WinFormWrapper>
            <VoucherFormWrapper>
              <VoucherForm voucher="0xD69bcE4E8D0929E16" withdrawnBid={withdrawnBid} />
            </VoucherFormWrapper>
          </WrapperRow>
        )
      ) : (
        <Wrapper>
          <WinBidForm
            bid={bid}
            setView={setView}
            win={win}
            withdrawnBid={withdrawnBid}
            setWithdrawnBid={setWithdrawnBid}
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
