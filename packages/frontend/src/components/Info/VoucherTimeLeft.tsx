import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'
import { useAuctionState, useAuctionTime } from 'src/hooks'
import { Colors } from 'src/styles/colors'
import { formatEndDate } from 'src/utils/formatters'
import styled from 'styled-components'

import { RemainingTime } from './TimeLeft'

const REDEEM_PERIOD = 48

export const VoucherTimeLeft = () => {
  const state = useAuctionState()
  const isPeriodExpired = state === 'ClaimingFlow'
  const timestamp = useAuctionTime()
  const redeemTimestamp = timestamp && BigNumber.from(moment.unix(timestamp?.toNumber()).add(REDEEM_PERIOD, 'h').unix())

  return (
    <VoucherTimeBox isPeriodExpired={isPeriodExpired}>
      <TimeRow isPeriodExpired={isPeriodExpired}>
        <span>{isPeriodExpired ? 'Voucher redeem period expired on ' : 'Voucher redeem period: '}</span>
        {!isPeriodExpired && <RemainingTime>{formatEndDate(timestamp)} - </RemainingTime>}
        <RemainingTime>{formatEndDate(redeemTimestamp)}</RemainingTime>
      </TimeRow>
    </VoucherTimeBox>
  )
}

interface TimeProps {
  isPeriodExpired: boolean
}

const VoucherTimeBox = styled.div<TimeProps>`
  width: calc(100% - 54px);
  padding: 8px 24px 8px 68px;
  background: ${({ isPeriodExpired }) => (isPeriodExpired ? Colors.RedLight : Colors.Blue)};
`
const TimeRow = styled.div<TimeProps>`
  display: flex;
  align-items: center;
  column-gap: 8px;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 1112px;
  margin: 0 auto;

  font-family: 'Space Mono', 'Roboto Mono', monospace;
  color: ${({ isPeriodExpired }) => (isPeriodExpired ? Colors.RedDark : Colors.White)};
`
