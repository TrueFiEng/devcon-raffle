import { task, types } from 'hardhat/config'
import { deployTestnetAuctionRaffle } from 'scripts/deploy/deploy'
import { BigNumberish, constants, Contract, Signer, utils, Wallet } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { connectToAuctionRaffle } from 'scripts/utils/auctionRaffle'
import writeFileAtomic from 'write-file-atomic'

const testnetAuctionRaffleAddress = '0x17c9FE0c1B4d6dCC61f71064095e60b7A87514cF'

task('generate-dotenv', 'Generate .env file needed for other tasks')
  .addParam('path', 'location of the file', '../../.env', types.string)
  .addParam('count', 'number of wallets to generate', 20, types.int)
  .setAction(async ({ path, count }: { path: string, count: number }, hre) => {
    const keys = Array(count).fill('').map(_ => Wallet.createRandom().privateKey)
    const deployer = hre.config.networks.rinkeby.accounts[0]
    const output = createDotenv(deployer, keys)
    console.log(output)
    await writeFileAtomic(path, output)
  })

task('transfer-ether', 'Transfers ether from DEPLOYER account to PRIVATE_KEYS accounts')
  .addParam('value', 'ETH amount to send', '0.001', types.string, true)
  .setAction(async ({ value }: { value: string }, hre) => {
    const [deployer] = await hre.ethers.getSigners()

    const amountToSend = parseEther(value)
    const privateKeys: string[] = JSON.parse(process.env.PRIVATE_KEYS)
    for (const privateKey of privateKeys) {
      const wallet = new Wallet(privateKey, hre.ethers.provider)
      const tx = await deployer.sendTransaction({
        to: wallet.address,
        value: amountToSend,
      })
      await tx.wait()
      console.log(`Sent ${formatEther(amountToSend)}${constants.EtherSymbol} to ${wallet.address}`)
    }
  })

task('deploy', 'Deploys AuctionRaffle contract')
  .addParam('delay', 'Time in seconds to push forward bidding start time', 0, types.int, true)
  .setAction(async ({ delay }: { delay: number }, hre) => {
    const [deployer] = await hre.ethers.getSigners()

    console.log('Deploying contracts...')
    const now = Math.floor(Date.now() / 1000)
    const biddingStartTime = now + delay
    const auctionRaffle = await deployTestnetAuctionRaffle(biddingStartTime, deployer, hre)
    console.log('AuctionRaffle address: ', auctionRaffle.address)
    console.log('Contracts deployed\n')
  })

task('init-bids', 'Places initial bids using PRIVATE_KEYS accounts')
  .setAction(async (_, hre) => {
    console.log('Placing initial bids...')
    const initialBidAmount = utils.parseUnits('0.20', 9)
    const bidIncrement = utils.parseUnits('0.02', 9)

    const auctionRaffle = await connectToAuctionRaffle(hre, getTestnetAuctionRaffleAddress())

    const privateKeys: string[] = JSON.parse(process.env.PRIVATE_KEYS)
    for (let i = 0; i < privateKeys.length; i++) {
      const wallet = new Wallet(privateKeys[i], hre.ethers.provider)
      await bidAs(auctionRaffle, wallet, initialBidAmount.add(bidIncrement.mul(i)))
    }
  })

export async function bidAs(auctionRaffle: Contract, signer: Signer, value: BigNumberish) {
  const auctionRaffleAsSigner = auctionRaffle.connect(signer)
  const tx = await auctionRaffleAsSigner.bid({ value })
  const { gasUsed } = await tx.wait()
  console.log(`Bid ${value.toString()} wei as ${await signer.getAddress()}, gasUsed: ${gasUsed.toString()}`)
}

function createDotenv(deployer: string, keys: string[]): string {
  return `DEPLOYER=${deployer}
PRIVATE_KEYS='[
${keys.map(key => `  "${key}"`).join(',\n')}
]'
VITE_NETWORK=ArbitrumRinkeby
VITE_TESTNET_DEVCON=${testnetAuctionRaffleAddress}
`
}

function getTestnetAuctionRaffleAddress() {
  return process.env.VITE_TESTNET_DEVCON || testnetAuctionRaffleAddress
}
