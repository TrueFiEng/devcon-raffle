import { setupFixtureLoader } from '../setup'
import { devcon6E2EFixture, reservePrice } from 'fixtures/devcon6Fixture'
import { Devcon6Mock } from 'contracts'
import { Provider } from '@ethersproject/providers'
import { BigNumber, Wallet } from 'ethers'
import { randomBigNumbers } from 'scripts/utils/random'
import { expect } from 'chai'
import { heapKey } from 'utils/heapKey'
import { network } from 'hardhat'
import { HOUR } from 'utils/consts'
import { compareBids } from 'utils/compareBids'

interface Bid {
  bidderID: number,
  amount: BigNumber,
  wallet: Wallet
}

describe('Devcon6 - E2E', function() {
  const loadFixture = setupFixtureLoader()

  let provider: Provider
  let devcon: Devcon6Mock
  let devconAsOwner: Devcon6Mock
  let wallets: Wallet[]

  let bids: Bid[]
  let sortedBids: Bid[]

  before('prepare contracts', async function() {
    ({ provider, devcon, wallets } = await loadFixture(devcon6E2EFixture))
    devconAsOwner = devcon.connect(owner())
  })

  before('prepare bids', function() {
    bids = randomBigNumbers(30).map((bn, index): Bid => ({
        bidderID: index + 1,
        amount: bn.shr(192).add(reservePrice),
        wallet: wallets[index],
      }),
    )

    // introduce some duplicate amounts
    for (let i = 0; i < 15; i += 3) {
      bids[i].amount = bids[i+2].amount
    }

    sortedBids = bids.slice().sort(compareBids)
  })

  it('lets 30 participants place bids', async function() {
    for (let { amount, wallet } of bids) {
      await devcon.connect(wallet).bid({ value: amount, gasLimit: 800_000 })
    }

    expect(await devcon.getRaffleParticipants()).to.have.lengthOf(30)
    expect(await devcon.getHeap()).to.have.lengthOf(10)
    const tenthBid = sortedBids[9]
    expect(await devcon.getMinKeyValue()).to.eq(heapKey(tenthBid.bidderID, tenthBid.amount))
  })

  it('lets the owner settle the auction', async function() {
    await endBidding(devconAsOwner)
    await devconAsOwner.settleAuction()

    expect(await devcon.getHeap()).to.be.empty

    const expectedAuctionWinners = sortedBids.slice(0, 10).map(bid => BigNumber.from(bid.bidderID))
    expect(await devcon.getAuctionWinners()).to.deep.eq(expectedAuctionWinners)
    expect(await devcon.getRaffleParticipants()).to.have.lengthOf(20)
  })

  it('lets the owner settle the raffle', async function() {
    await devconAsOwner.settleRaffle(randomBigNumbers(2))

    expect(await devcon.getRaffleWinners()).to.have.lengthOf(16)
    expect(await devcon.getRaffleParticipants()).to.have.lengthOf(4)
  })

  it('lets everyone claim their funds', async function() {
    const nonAuctionBids = sortedBids.slice(10)

    for (const { wallet, bidderID } of nonAuctionBids.slice(0, 10)) {
      await devcon.connect(wallet).claim(bidderID)
    }

    await devconAsOwner.claimProceeds()
    await devconAsOwner.claimFees(4)

    for (const { wallet, bidderID } of nonAuctionBids.slice(10, 20)) {
      await devcon.connect(wallet).claim(bidderID)
    }

    expect(await provider.getBalance(devcon.address)).to.eq(0)
  })

  it('divides bidders into 3 disjoint sets', async function() {
    const bidders = [
      ...await devcon.getAuctionWinners(),
      ...await devcon.getRaffleWinners(),
      ...await devcon.getRaffleParticipants()
    ]

    let bids = []
    for (let bidder of bidders) {
      bids.push(await devcon.getBidByID(bidder))
    }
    bids = bids.sort(compareBids).map(bid => ({
      bidderID: bid.bidderID.toNumber(),
      amount: bid.amount,
    }))

    const expectedBids = sortedBids.map(({ bidderID, amount}) => ({bidderID, amount}))
    expect(bids).to.deep.eq(expectedBids)
  })

  function owner() {
    return wallets[1]
  }

  async function endBidding(devcon: Devcon6Mock) {
    const endTime = await devcon.biddingEndTime()
    await network.provider.send('evm_setNextBlockTimestamp', [endTime.add(HOUR).toNumber()])
    await network.provider.send('evm_mine')
  }
})
