import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import { FormWrapper } from 'src/components/Form/Form'
import { formatEndDateText } from 'src/utils/formatters/formatEndDateText'
import styled from 'styled-components'

export const BidAwaiting = () => {
  const [endTimestamp] = useState(BigNumber.from(Math.floor(Date.now() / 1000) + 1234))
  const { dateText, timeText } = formatEndDateText(endTimestamp)

  return (
    <BidStartWrapper>
      <h2>
        Bidding will start on {dateText} at {timeText}
      </h2>
    </BidStartWrapper>
  )
}

const BidStartWrapper = styled(FormWrapper)`
  padding: 0 0 0 135px;
  justify-content: center;
`
