import * as Accordion from '@radix-ui/react-accordion'
import { ArrowDownIcon } from 'src/components/Icons'
import { Rule, RuleText } from 'src/components/Info/Rules'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useRaffleWinnersCount } from 'src/hooks/useRaffleWinnersCount'
import { Colors } from 'src/styles/colors'
import styled from 'styled-components'

export const InfoAccordion = () => {
  const auctionWinnersCount = useAuctionWinnersCount()
  const raffleWinnersCount = useRaffleWinnersCount()
  const totalCount = auctionWinnersCount && raffleWinnersCount && auctionWinnersCount + raffleWinnersCount
  const reservePrice = 0.15
  const exampleBid = 0.2

  return (
    <Wrapper>
      <Accordion.Root type="single" defaultValue="item-1" collapsible>
        <Accordion.Item value="item-1">
          <StyledHeader>
            <AccordionStyledTrigger heading="How to buy a ticket for Devcon 6?" />
          </StyledHeader>
          <StyledContent>
            Join the contest by submitting your bid. Bid high to win in the auction, or take your chance in the raffle.
            You need to bid at least the price of a Devcon ticket.
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <StyledHeader>
            <AccordionStyledTrigger heading="Contest rules" />
          </StyledHeader>
          <StyledContent>
            <RuleText>
              The total number of {totalCount} tickets will be divided between the auction and the raffle pools. All
              winners will receive a voucher code that is redeemable for a free Devcon ticket.
            </RuleText>
            <Rule
              heading={`Auction pool: ${auctionWinnersCount}`}
              rule="Tickets from the auction pool will be distributed to the highest bidding participants.
              The price paid by a winner in that pool is equal to the amount of their bid.
              All proceeds will go towards X-Public-Good."
              example={`You bid ${exampleBid * 2.5} ETH and end up in top ${auctionWinnersCount} of bidders.
              You receive a ticket for ${exampleBid * 2.5} ETH.`}
            />
            <Rule
              heading={`Raffle pool: ${raffleWinnersCount}`}
              rule={`From participants who bid below the last bid in the auction pool, ${raffleWinnersCount} will be chosen at random.
              A winner in that pool will receive a ticket for ${reservePrice} ETH. All funds that they bid over that price will be claimable after the raffle is stettled.`}
              example={`You bid ${exampleBid} ETH and end up below top ${auctionWinnersCount}. If you are selected in the raffle, you pay ${reservePrice}
              ETH for the ticket and get ${(exampleBid - reservePrice).toFixed(2)} ETH back.`}
            />
            <Rule
              heading="Golden Ticket: 1"
              rule="One lucky bidder from the raffle pool will receive a ticket for Devcon 6 totally for free!
              The Golden Ticket winner will be able to claim the whole amount of their bid after the raffle is settled."
            />
            <Rule
              heading="No luck?"
              rule="In case you don't win, your bid (-2% fee) will be claimable after the raffle is settled."
              example={`You bid ${exampleBid} ETH and end up not winning a ticket.
              You can get ${(exampleBid * 98) / 100} ETH back.`}
            />
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-3">
          <StyledHeader>
            <AccordionStyledTrigger heading="In what form will I get the ticket?" />
          </StyledHeader>
          <StyledContent>
            After the raffle is settled, you will be able to claim a voucher code for the ticket. In order to do so, you
            will be asked to sign a message using your wallet to authenticate as the owner of the winning account. The
            voucher code will be presented to you on this page.
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-4">
          <StyledHeader>
            <AccordionStyledTrigger heading="Okay, I got a voucher code. What do I do now?" />
          </StyledHeader>
          <StyledContent>
            You can go to LINK_HERE to redeem your voucher code for a Devcon 6 ticket. See you at the conference!
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
  width: 100%;
  max-width: 1252px;
  margin: 0 auto;
  padding: 68px 125px 68px 68px;
`
const StyledHeader = styled(Accordion.Header)`
  width: 100%;
`
const StyledTrigger = styled(Accordion.AccordionTrigger)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px 4px 4px;
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
