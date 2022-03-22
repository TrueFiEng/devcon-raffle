import { CheckIcon } from 'src/components/Icons/CheckIcon'
import { Transactions } from 'src/components/Transaction/TransactionEnum'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

const text = {
  [Transactions.Place]: 'placed your bid',
  [Transactions.Bump]: 'bumped your bid',
  [Transactions.Withdraw]: 'withdrawn your funds',
}

interface SuccessHeaderProps {
  action: Transactions
}

export function TransactionSuccessHeader({ action }: SuccessHeaderProps) {
  return (
    <SuccessHeaderWrap>
      <HeaderRowIconContainer>
        <CheckIcon color={Colors.White} size={32} />
      </HeaderRowIconContainer>
      <SuccessText>You've successfully {text[action]}!</SuccessText>
    </SuccessHeaderWrap>
  )
}

const SuccessHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`

const HeaderRowIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid ${Colors.White};
`

const SuccessText = styled.span`
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  color: ${Colors.White};
`
