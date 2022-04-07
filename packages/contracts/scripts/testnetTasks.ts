import { task, types } from 'hardhat/config'
import { deploy, deployDevcon, minBidIncrement } from 'scripts/deploy/deploy'
import { Devcon6, Devcon6__factory } from 'contracts'
import { BigNumberish, utils } from 'ethers'

const bidders = [
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
  '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
  '0x976ea74026e726554db657fa54763abd0c3a0aa9',
  '0x14dc79964da2c08b23698b3d3cc7ca32193d9955',
  '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
  '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
  '0xbcd4042de499d14e55001ccbb24a551f3b954096',
  '0x71be63f3384f5fb98995898a86b02fb2426c5788',
  '0xfabb0ac9d68b0b445fb7357272ff202c5651694a',
  '0x1cbd3b2770909d4e10f157cabc84c7264073c9ec',
  '0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097',
  '0xcd3b766ccdd6ae721141f452c550ca635964ce71',
  '0x2546bcd3c84621e976d8185a91a922ae77ecec30',
  '0xbda5747bfd65f08deb54cb465eb87d40e51b197e',
  '0xdd2fd4581271e230360230f9337d5c0430bf44c0',
  '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199',
  '0x09db0a93b389bef724429898f539aeb7ac2dd55f',
]

const devconAddress = '0xd92fa056843C0ef9857B745cF4Ad66d84AD7a347'

task('deploy', 'Deploys')
  .addParam('delay', 'Time in seconds to push forward bidding start time', 0, types.int, true)
  .setAction(async ({ delay }: { delay: number }, hre) => {
    const [deployer] = await hre.ethers.getSigners()

    console.log('Deploying contracts...')
    const now = Math.floor(Date.now() / 1000)
    const biddingStartTime = now + delay
    const devcon = await deployDevcon(biddingStartTime, deployer, hre)
    console.log('Devcon6 address: ', devcon.address)
    console.log('Contracts deployed\n')
  })


task('bid20', 'Places initial bids')
  .setAction(async (_, hre) => {
    const [deployer] = await hre.ethers.getSigners()
    const devcon = Devcon6__factory.connect(devconAddress, deployer)

    console.log('Placing initial bids...')
    const initialBidAmount = utils.parseUnits('0.20', 9)
    for (let i = 0; i < bidders.length; i++) {
      await bidAs(devcon, bidders[i], initialBidAmount.add(minBidIncrement.mul(i)))
    }
  })

task('getState', 'Returns state')
  .setAction(async (_, hre) => {
    const [deployer] = await hre.ethers.getSigners()
    const devcon = Devcon6__factory.connect(devconAddress, deployer)

    const heap = await devcon.getHeap()
    heap.forEach(({bidderID, amount}, index) => {
      console.log(`#${index}: bidderID: ${bidderID}, amount: ${amount}`);
    })

    const raffleParticipants = await devcon.getRaffleParticipants()
    const p = raffleParticipants.map(bidderID => bidderID.toString()).join(', ')
    console.log(`raffleParticipants = [${p}]`);

    const state = await devcon.getState()
    console.log(`state = ${state}`);
  })

task('settleAuction', 'Settles the auction')
  .setAction(async (_, hre) => {
    const [deployer] = await hre.ethers.getSigners()
    const devcon = Devcon6__factory.connect(devconAddress, deployer)

    console.log('Settling auction...')
    const tx = await devcon.settleAuction()
    const receipt = await tx.wait()
    console.log(`Auction settled, gas used: ${receipt.gasUsed}`);
  })

export async function bidAs(devcon: Devcon6, bidder: string, value: BigNumberish) {
  const tx = await devcon.bid({ value })
  const { gasUsed } = await tx.wait()
  console.log(`Bid ${value.toString()} wei as ${bidder}, gasUsed: ${gasUsed.toString()}`);
}
