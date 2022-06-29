import { FormWideWrapper } from 'src/components/Form/Form'
import { useAuctionTime } from 'src/hooks'
import { formatEndDateText } from 'src/utils/formatters'

export const BidAwaiting = () => {
  const timestamp = useAuctionTime()
  if (!timestamp) {
    return <></>
  }

  const { dateText, timeText } = formatEndDateText(timestamp)
  return (
    <FormWideWrapper>
      <h2>
        Bidding will start on {dateText} at {timeText}
      </h2>
    </FormWideWrapper>
  )
}
