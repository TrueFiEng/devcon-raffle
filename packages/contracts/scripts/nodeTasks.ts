import { task, types } from 'hardhat/config'

task('increase-time', 'Increases block time')
  .addParam('value', 'Time in seconds to increase', undefined, types.int, false)
  .setAction(async ({ value }: { value: number }, hre) => {
    const provider = hre.network.provider

    console.log('Increasing time by %d seconds', value)
    await provider.send('evm_increaseTime', [value])
    await provider.send('evm_mine')
  })

task('accounts', 'Prints available accounts')
  .setAction(async (
    taskArgs,
    hre,
  ) => {
    const signers = await hre.ethers.getSigners()
    signers.forEach((signer, index) => console.log(`Account #${index} ${signer.address}`))
  })
