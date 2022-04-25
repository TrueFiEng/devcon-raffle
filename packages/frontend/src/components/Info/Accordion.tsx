import * as Accordion from '@radix-ui/react-accordion'
import { ArrowDownIcon } from 'src/components/Icons/ArrowDownIcon'
import { Rule, RuleText } from 'src/components/Info/Rules'
import { useAuctionWinnersCount } from 'src/hooks/useAuctionWinnersCount'
import { useMinimumBid } from 'src/hooks/useMinimumBid'
import { useRaffleWinnersCount } from 'src/hooks/useRaffleWinnersCount'
import { Colors } from 'src/styles/colors'
import { formatEtherAmount } from 'src/utils/formatters/formatEtherAmount'
import styled from 'styled-components'

export const InfoAccordion = () => {
  const auctionWinnersCount = useAuctionWinnersCount()
  const raffleWinnersCount = useRaffleWinnersCount()
  const totalCount = auctionWinnersCount && raffleWinnersCount && auctionWinnersCount + raffleWinnersCount
  const minimumBid = useMinimumBid()
  const reservePrice = Number(formatEtherAmount(minimumBid))
  const exampleBid = 0.2

  return (
    <Wrapper>
      <Accordion.Root type="single" defaultValue="item-1" collapsible>
        <Accordion.Item value="item-1">
          <StyledHeader>
            <AccordionStyledTrigger heading="How to buy a ticket for Devcon 6?" />
          </StyledHeader>
          <StyledContent>
            Join the ruffle by submitting your bid. Bid high to win an action or take your chance in a raffle pool. The
            cost to participate will be at least the cost of a Devcon ticket.
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <StyledHeader>
            <AccordionStyledTrigger heading="Raffle rules" />
          </StyledHeader>
          <StyledContent>
            <RuleText>
              Total number of {totalCount} raffle tickets is devided between auction pool and raffle pool. Auction
              winners will win a voucher Code that is redeemable for a free Devcon ticket. Raffle winners will receive a
              voucher code that is redeemable for 1 Devcon Ticket at full price.
            </RuleText>
            <Rule
              heading={`Auction pool: ${auctionWinnersCount}`}
              rule="Tickets from auction pool will be distributed to the highest bidding participants. The cost of a Devcon
              ticket in that pool is equal to the bid. All proceeds will go towards X Public Good."
              example={`You bid ${
                exampleBid * 2.5
              } ETH and end up in top ${auctionWinnersCount} of bidders. You receive the ticket for 
              ${exampleBid * 2.5} ETH.`}
            />
            <Rule
              heading={`Raffle pool: ${raffleWinnersCount}`}
              rule={`From participants who bid below the price of auction pool, ${raffleWinnersCount} will be randomly given a voucher code to buy
              a Devcon ticket at full price, which is ${reservePrice} ETH. All the funds over that price will be refunded to
              bidders.`}
              example={`You bid ${exampleBid} ETH and end up below top ${auctionWinnersCount}. If the raffle selects you, you pay ${reservePrice}
              ETH for the ticket and get ${(exampleBid - reservePrice).toFixed(2)} ETH back.`}
            />
            <Rule
              heading="Golden Ticket: 1"
              rule="One lucky bidder from raffle pool will get the ticket for Devcon 6 totally for free! All funds of the
              Golden Ticket winner will be claimable after the raffle is settled."
            />
            <Rule
              heading="No luck?"
              rule="Didn't win. Your bid (-2% fee) will be claimable after the raffle is settled."
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
            The ticket is an NFT token held in your wallet. A unique token will be minted in the same moment you make a
            bid. If your bid wins the auction or the raffle – it will become a valid Devcon 6 ticket.
          </StyledContent>
        </Accordion.Item>

        <Accordion.Item value="item-4">
          <StyledHeader>
            <AccordionStyledTrigger heading="Okay, I got a ticket. What now?" />
          </StyledHeader>
          <StyledContent>
            You will be asked to sign a message with you wallet at the Devcon 6 event. Be sure to bring a device with
            the same wallet that holds the ticket token!
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
