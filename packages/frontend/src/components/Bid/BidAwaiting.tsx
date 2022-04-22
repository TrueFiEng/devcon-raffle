import { FormSectionWrapper } from 'src/components/Form/Form'
import { useAuctionTime } from 'src/hooks/useAuctionTime'
import { formatEndDateText } from 'src/utils/formatters'
import styled from 'styled-components'

export const BidAwaiting = () => {
  const timestamp = useAuctionTime()
  if (!timestamp) {
    return <></>
  }

  const { dateText, timeText } = formatEndDateText(timestamp)
  return (
    <BidStartWrapper>
      <h2>
        Bidding will start on {dateText} at {timeText}
      </h2>
    </BidStartWrapper>
  )
}

const BidStartWrapper = styled(FormSectionWrapper)`
  padding: 0 0 0 135px;
`
