import { task, types } from 'hardhat/config'
import { devconAddress } from 'scripts/utils/devcon'
import { BigNumberish, constants, utils } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

const devconArtifactName = 'contracts/Devcon6.sol:Devcon6'

task('fast-forward', 'Fast forwards block time')
  .addParam<number>('value', 'Time in seconds to fast forward', undefined, types.int, false)
  .setAction(async ({ value }: { value: number }, hre) => {
    const provider = hre.network.provider

    console.log('Fast forwarding %d seconds', value)
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
    await devcon.bid({value: ethAmount})
    logBid(address, ethAmount)
  })

function logBid(address: string, bidAmount: BigNumberish) {
  console.log(`Account ${address} bid ${formatEther(bidAmount)}`)
}

function formatEther(amount: BigNumberish): string {
  return `${utils.formatEther(amount).toString()}${constants.EtherSymbol}`
}
