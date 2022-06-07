export function getFirstRaffleBidIndex(bidsLength: number, auctionWinnersCount: number, raffleWinnersCount: number) {
  const raffleBidsOffset = Math.max(0, bidsLength - raffleWinnersCount)
  return raffleBidsOffset >= auctionWinnersCount ? auctionWinnersCount : raffleBidsOffset
}
