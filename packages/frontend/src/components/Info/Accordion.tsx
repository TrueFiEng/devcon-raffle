import * as Accordion from '@radix-ui/react-accordion'
import { ArrowDownIcon } from 'src/assets/ArrowDown'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const InfoAccordion = () => {
  return (
    <Wrapper>
      <Accordion.Root type="single" defaultValue="item-1" collapsible>
        <StyledItem value="item-1">
          <StyledHeader>
            <StyledTrigger>
              <span>How to buy a ticket for Devon 6?</span>
              <AccordionArrow color={Colors.Black} size={22} />
            </StyledTrigger>
          </StyledHeader>
          <StyledContent>
            Join the ruffle by submitting your bid. Bid high, to win an action or take your chance in a raffle pool. The
            cost to participate will be at LEAST the cost of a Devcon ticket.
          </StyledContent>
        </StyledItem>

        <StyledItem value="item-2">
          <StyledHeader>
            <StyledTrigger>
              <span>Raffle rules</span>
              <AccordionArrow color={Colors.Black} size={22} />
            </StyledTrigger>
          </StyledHeader>
          <StyledContent>
            <p>
              Total number of 100 raffle tickets is devided between auction pool and raffle pool. Auction winners will
              win a Voucher Code that is redeemable for a Free Devcon ticket. Raffle winners will receive a voucher code
              that is redeemable for 1 Devcon Ticket at Full Price.
            </p>
            <h4>Auction pool: 20</h4>
            <p>
              Tickets from auction pool will be distributed to the highest bidding participants. The cost of a Devcon
              ticket in that pool is equal to the bid. All proceeds will go towards X Public Good. <br />
              <span>Example:</span> You bid 0.5 ETH and end up in top 20 of bidders. You receive the ticket for 0.5 ETH.
            </p>
            <h4>Raffle pool: 80</h4>
            <p>
              From participants who bid below the price of auction pool, 80 will be randomly given a Voucher Code to buy
              a Devcon ticket at full price, which is 0.15 ETH. All the funds above that price will be refunded to
              bidders. <br />
              <span>Example:</span> You bid 0.20 ETH and end up below top 200. If the raffle selects you, you pay 0.15
              ETH for the ticket and get 0.049 ETH back.
            </p>
            <h4>Golden Ticket: 1</h4>
            <p>
              One lucky bidder from raffle pool will get the ticket for Devon 6 totally for free! All funds of the
              Golden Ticket winner will be claimable after the sale is over.
            </p>
            <h4>No luck?</h4>
            <p>
              One lucky bidder from raffle pool will get the ticket for Devon 6 totally for free! All funds of the
              Golden Ticket winner will be claimable after the sale is over.
            </p>
          </StyledContent>
        </StyledItem>

        <StyledItem value="item-3">
          <StyledHeader>
            <StyledTrigger>
              <span>In what form will I get the ticket?</span>
              <AccordionArrow color={Colors.Black} size={22} />
            </StyledTrigger>
          </StyledHeader>
          <StyledContent>
            The ticket is an NFT token held in your wallet. A unique token will be minted in the same moment you make a
            bid. If your bid will win the auction or the raffle – it becomes a valid Devon 6 ticket.
          </StyledContent>
        </StyledItem>

        <StyledItem value="item-4">
          <StyledHeader>
            <StyledTrigger>
              <span>Okay, I got a ticket. What now?</span>
              <AccordionArrow color={Colors.Black} size={22} />
            </StyledTrigger>
          </StyledHeader>
          <StyledContent>
            You will be asked to sign a message with you wallet at the Devon 6 event. Be sure to bring a device with the
            same wallet that holds the ticket token!
          </StyledContent>
        </StyledItem>
      </Accordion.Root>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 60px 100px 60px 82px;
`
const StyledHeader = styled(Accordion.Header)`
  width: 100%;
  border-bottom: 1px solid ${Colors.Black};
`
const StyledItem = styled(Accordion.Item)`
  margin-bottom: 24px;
`
const StyledTrigger = styled(Accordion.AccordionTrigger)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${Colors.Transparent};
  padding-bottom: 16px;
  border: none;
  font-weight: 600;
  font-size: 22px;
  line-height: 32px;

  &[data-state='open'] > div {
    transform: translateY(50%) rotate(180deg);
  }
`

const StyledContent = styled(Accordion.AccordionContent)`
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.Shuttle};
  overflow-y: scroll;
  margin-top: 32px;

  & p {
    margin-bottom: 16px;
  }

  & span {
    color: ${Colors.Black};
  }
`

const AccordionArrow = styled(ArrowDownIcon)`
  transition: transform 100ms;
  transform: translateY(50%) rotate(0);
  transform-origin: top;
`
