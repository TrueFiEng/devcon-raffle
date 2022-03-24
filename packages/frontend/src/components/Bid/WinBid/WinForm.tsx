import { BigNumber } from '@ethersproject/bignumber'
import { BidFlowSteps } from 'src/components/Bid/BidFlowEnum'
import { VoucherForm } from 'src/components/Bid/WinBid/VoucherForm'
import { WinBidForm } from 'src/components/Bid/WinBid/WinBidForm'
import { WinOptions } from 'src/components/Bid/WinBid/WinFlowEnum'
import { FormWrapper } from 'src/components/Form/Form'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface WinFormProps {
  win?: WinOptions
  bid: BigNumber
  withdrawnBid: boolean
  setWithdrawnBid: (val: boolean) => void
  setView: (state: BidFlowSteps) => void
  voucher: boolean
  setVoucher: (val: boolean) => void
}

export const WinForm = ({ win, bid, withdrawnBid, setWithdrawnBid, setView, voucher, setVoucher }: WinFormProps) => {
  return (
    <>
      {((!withdrawnBid && !voucher) || (withdrawnBid && !voucher)) && (
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
      {withdrawnBid && voucher && (
        <Wrapper>
          <VoucherForm voucher="0xD69bcE4E8D0929E16" withdrawnBid={withdrawnBid} />{' '}
        </Wrapper>
      )}

      {!withdrawnBid && voucher && (
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
