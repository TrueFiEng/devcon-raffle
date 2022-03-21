import { task, types } from 'hardhat/config'
import { devconAddress } from 'scripts/utils/devcon'
import { BigNumberish, constants, Contract, utils } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const devconArtifactName = 'contracts/Devcon6.sol:Devcon6'

task('increase-time', 'Increases block time')
  .addParam<number>('value', 'Time in seconds to increase', undefined, types.int, false)
  .setAction(async ({ value }: { value: number }, hre) => {
    const provider = hre.network.provider

    console.log('Increasing time by %d seconds', value)
    await provider.send('evm_increaseTime', [value])
    await provider.send('evm_mine')
  })

task('bid', 'Places bid for given account with provided amount')
  .addParam<string>('address', 'The bidder\'s address')
  .addParam<string>('amount', 'The bid\'s amount in ETH', undefined, types.string)
  .setAction(async (
    { address, amount }: { address: string, amount: string },
    hre,
  ) => {
    const signer = await hre.ethers.getSigner(address)
    const devconFactory = await hre.ethers.getContractFactory(devconArtifactName)
    const devcon = devconFactory.attach(devconAddress).connect(signer)

    const ethAmount = parseEther(amount)
    await devcon.bid({ value: ethAmount })
    logBid(address, ethAmount)
  })

task('settle-auction', 'Settles auction')
  .addParam('winners', 'Array of winners IDs', undefined, types.json)
  .setAction(async (
    { winners }: { winners: number[] },
    hre,
  ) => {
    const devcon = await devconAsOwner(hre)

    await devcon.settleAuction(winners)
    console.log("Auction settled!")
  })

task('accounts', 'Prints available accounts')
  .setAction(async (
    taskArgs,
    hre,
  ) => {
    const signers = await hre.ethers.getSigners()
    signers.forEach((signer, index) => console.log(`Account #${index} ${signer.address}`))
  })

function logBid(address: string, bidAmount: BigNumberish) {
  console.log(`Account ${address} bid ${formatEther(bidAmount)}`)
}

function formatEther(amount: BigNumberish): string {
  return `${utils.formatEther(amount).toString()}${constants.EtherSymbol}`
}

async function devconAsOwner(hre: HardhatRuntimeEnvironment): Promise<Contract> {
  const owner = await getDevconOwner(hre)
  const devconFactory = await hre.ethers.getContractFactory(devconArtifactName)
  return devconFactory.attach(devconAddress).connect(owner)
}

async function getDevconOwner(hre: HardhatRuntimeEnvironment): Promise<SignerWithAddress>{
  const signers = await hre.ethers.getSigners()
  return signers[0]
}
