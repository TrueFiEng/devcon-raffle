import * as Accordion from '@radix-ui/react-accordion'
import { ArrowDownIcon } from 'src/components/Icons/ArrowDownIcon'
import { Rule, RuleText } from 'src/components/Info/Rules'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const InfoAccordion = () => {
  return (
    <Wrapper>
      <Accordion.Root type="single" defaultValue="item-1" collapsible>
        <Accordion.Item value="item-1">
          <StyledHeader>
            <AccordionStyledTrigger heading="How to buy a ticket for Devon 6?" />
          </StyledHeader>
          <StyledContent>
            Join the ruffle by submitting your bid. Bid high, to win an action or take your chance in a raffle pool. The
            cost to participate will be at LEAST the cost of a Devcon ticket.
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <StyledHeader>
            <AccordionStyledTrigger heading="Raffle rules" />
          </StyledHeader>
          <StyledContent>
            <RuleText>
              Total number of 100 raffle tickets is devided between auction pool and raffle pool. Auction winners will
              win a Voucher Code that is redeemable for a Free Devcon ticket. Raffle winners will receive a voucher code
              that is redeemable for 1 Devcon Ticket at Full Price.
            </RuleText>
            <Rule
              heading="Auction pool: 20"
              rule="Tickets from auction pool will be distributed to the highest bidding participants. The cost of a Devcon
              ticket in that pool is equal to the bid. All proceeds will go towards X Public Good."
              example="You bid 0.5 ETH and end up in top 20 of bidders. You receive the ticket for 0.5 ETH."
            />
            <Rule
              heading="Raffle pool: 80"
              rule="From participants who bid below the price of auction pool, 80 will be randomly given a Voucher Code to buy
              a Devcon ticket at full price, which is 0.15 ETH. All the funds above that price will be refunded to
              bidders."
              example="You bid 0.20 ETH and end up below top 200. If the raffle selects you, you pay 0.15
              ETH for the ticket and get 0.049 ETH back."
            />
            <Rule
              heading="Golden Ticket: 1"
              rule="One lucky bidder from raffle pool will get the ticket for Devon 6 totally for free! All funds of the
              Golden Ticket winner will be claimable after the sale is over."
            />
            <Rule
              heading="No luck?"
              rule="Didn't win. Your bid (-2% fee) will be claimable after the sale is over."
              example="You bid 0.20 ETH and end up not winning a ticket. You can get 0.196 ETH back."
            />
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-3">
          <StyledHeader>
            <AccordionStyledTrigger heading="In what form will I get the ticket?" />
          </StyledHeader>
          <StyledContent>
            The ticket is an NFT token held in your wallet. A unique token will be minted in the same moment you make a
            bid. If your bid will win the auction or the raffle – it becomes a valid Devon 6 ticket.
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-4">
          <StyledHeader>
            <AccordionStyledTrigger heading="Okay, I got a ticket. What now?" />
          </StyledHeader>
          <StyledContent>
            You will be asked to sign a message with you wallet at the Devon 6 event. Be sure to bring a device with the
            same wallet that holds the ticket token!
          </StyledContent>
        </Accordion.Item>
      </Accordion.Root>
    </Wrapper>
  )
}

interface AccordionTriggerProps {
  heading: string
}

const AccordionStyledTrigger = ({ heading }: AccordionTriggerProps) => {
  return (
    <StyledTrigger>
      <span>{heading}</span>
      <AccordionArrow color={Colors.Black} size={22} />
    </StyledTrigger>
  )
}

const Wrapper = styled.div`
  padding: 60px 125px 60px 68px;
`
const StyledHeader = styled(Accordion.Header)`
  width: 100%;
`
const StyledTrigger = styled(Accordion.AccordionTrigger)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  font-family: 'Space Mono', 'Roboto Mono', monospace;
  font-style: normal;
  border: none;
  background-color: ${Colors.GreenLight};
  text-align: left;
  font-size: 20px;
  line-height: 1.5;

  &[data-state='open'] {
    font-weight: 700;
  }

  &[data-state='open'] > div {
    transform: translateY(100%) rotate(180deg);
  }
`

const StyledContent = styled(Accordion.AccordionContent)`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-top: 32px;

  &[data-state='open'] {
    margin-bottom: 32px;
  }
`

const AccordionArrow = styled(ArrowDownIcon)`
  transform: rotate(0);
  transform-origin: top;
`
