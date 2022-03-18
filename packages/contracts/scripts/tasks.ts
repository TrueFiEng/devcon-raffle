import { task, types } from 'hardhat/config'
import { bidAsSigner } from 'scripts/utils/bid'
import { Devcon6__factory } from 'contracts'
import { devconAddress } from 'scripts/utils/devcon'
import { BigNumberish, constants, utils } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

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
    const devcon = Devcon6__factory.connect(devconAddress, signer)

    const ethAmount = parseEther(amount)
    await bidAsSigner(devcon, signer, ethAmount)
    logBid(address, ethAmount)
  })

function logBid(address: string, bidAmount: BigNumberish) {
  console.log(`Account ${address} bid ${formatEther(bidAmount)}`)
}

function formatEther(amount: BigNumberish): string {
  return `${utils.formatEther(amount).toString()}${constants.EtherSymbol}`
}
