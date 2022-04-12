import { task, types } from 'hardhat/config'
import { connectToDevcon, devconAddress, heapAddress } from 'scripts/utils/devcon'
import { BigNumber, BigNumberish, constants, Contract, utils } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { randomBigNumbers } from 'scripts/utils/random'

task('bid', 'Places bid for given account with provided amount')
  .addParam('account', 'Hardhat account to use')
  .addParam('amount', 'The bid\'s amount in ETH', undefined, types.string)
  .setAction(async (
    { account, amount }: { account: string, amount: string },
    hre,
  ) => {
    const signer = await hre.ethers.getSigner(account)
    const devcon = await connectToDevcon(hre, devconAddress, heapAddress)
    const devconAsSigner = devcon.connect(signer)

    const ethAmount = parseEther(amount)
    await devconAsSigner.bid({ value: ethAmount })
    logBid(account, ethAmount)
  })

task('settle-auction', 'Settles auction')
  .setAction(async (taskArgs, hre) => {
    const devcon = await devconAsOwner(hre)

    await devcon.settleAuction()
    console.log('Auction settled!')
  })

task('settle-raffle', 'Settles raffle')
  .setAction(async (taskArgs, hre) => {
    const devcon = await devconAsOwner(hre)

    const raffleWinnersCount = await devcon.raffleWinnersCount()
    const randomNumbersCount = BigNumber.from(raffleWinnersCount).div(8).toNumber()

    await devcon.settleRaffle(randomBigNumbers(randomNumbersCount))
    console.log('Raffle settled!')
  })

function logBid(address: string, bidAmount: BigNumberish) {
  console.log(`Account ${address} bid ${formatEther(bidAmount)}`)
}

function formatEther(amount: BigNumberish): string {
  return `${utils.formatEther(amount).toString()}${constants.EtherSymbol}`
}

async function devconAsOwner(hre: HardhatRuntimeEnvironment): Promise<Contract> {
  const owner = await getDevconOwner(hre)
  const devcon = await connectToDevcon(hre, devconAddress, heapAddress)
  return devcon.connect(owner)
}

async function getDevconOwner(hre: HardhatRuntimeEnvironment): Promise<SignerWithAddress> {
  const signers = await hre.ethers.getSigners()
  return signers[0]
}
