import { task, types } from 'hardhat/config'
import { deployTestnetDevcon, minBidIncrement } from 'scripts/deploy/deploy'
import { Devcon6__factory } from 'contracts'
import { BigNumberish, constants, Signer, utils, Wallet } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'

const testnetDevconAddress = '0xd92fa056843C0ef9857B745cF4Ad66d84AD7a347'

task('deploy', 'Deploys devcon')
  .addParam('delay', 'Time in seconds to push forward bidding start time', 0, types.int, true)
  .setAction(async ({ delay }: { delay: number }, hre) => {
    const [deployer] = await hre.ethers.getSigners()

    console.log('Deploying contracts...')
    const now = Math.floor(Date.now() / 1000)
    const biddingStartTime = now + delay
    const devcon = await deployTestnetDevcon(biddingStartTime, deployer, hre)
    console.log('Devcon6 address: ', devcon.address)
    console.log('Contracts deployed\n')
  })

task('init-bids', 'Places initial bids')
  .setAction(async (_, hre) => {
    console.log('Placing initial bids...')
    const initialBidAmount = utils.parseUnits('0.20', 9)

    const privateKeys: string[] = JSON.parse(process.env.PRIVATE_KEYS)
    for (let i = 0; i < privateKeys.length; i++) {
      const wallet = new Wallet(privateKeys[i], hre.ethers.provider)
      await bidAs(wallet, initialBidAmount.add(minBidIncrement.mul(i)))
    }
  })

task('transfer-ether', 'Transfers ether')
  .addParam('value', 'ETH amount to send', "0.001", types.string, true)
  .setAction(async ({ value }: { value: string }, hre) => {
    const [deployer] = await hre.ethers.getSigners()

    const amountToSend = parseEther(value)
    const privateKeys: string[] = JSON.parse(process.env.PRIVATE_KEYS)
    for (const privateKey of privateKeys) {
      const wallet = new Wallet(privateKey, hre.ethers.provider)
      const tx = await deployer.sendTransaction({
        to: wallet.address,
        value: amountToSend
      })
      await tx.wait()
      console.log(`Sent ${formatEther(amountToSend)}${constants.EtherSymbol} to ${wallet.address}`)
    }
  })

export async function bidAs(signer: Signer, value: BigNumberish) {
  const devcon = Devcon6__factory.connect(testnetDevconAddress, signer)
  const tx = await devcon.bid({ value })
  const { gasUsed } = await tx.wait()
  console.log(`Bid ${value.toString()} wei as ${await signer.getAddress()}, gasUsed: ${gasUsed.toString()}`)
}
