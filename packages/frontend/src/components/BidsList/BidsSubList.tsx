import { BidsList } from 'src/components/BidsList/BidsList'
import { Bid } from 'src/models/Bid'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

interface Props {
  bids: Bid[]
  title: string
  showBidderID?: boolean
}

export const BidsSubList = ({ bids, title, showBidderID }: Props) => {
  return (
    <>
      <TitleBanner>
        <SubListHeader>{title}</SubListHeader>
      </TitleBanner>
      <BidsList bids={bids} showBidderID={showBidderID} />
    </>
  )
}

const TitleBanner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4px 0;
  background-color: ${Colors.GreenLight};
`

const SubListHeader = styled.h3`
  font-size: 20px;
  line-height: 150%;
`
