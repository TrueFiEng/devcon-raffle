import { task, types } from 'hardhat/config'
import { minStateDuration } from 'scripts/node/deploy'
import { BigNumber, utils } from 'ethers'
import { EthereumProvider } from 'hardhat/types'

task('increase-time', 'Increases block time')
  .addParam('value', 'Time in seconds to increase', minStateDuration, types.int, true)
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

interface Block {
  hash: string,
}

type GetBlockNumberResponse = Block | undefined | null

task('generate-random-numbers', 'Generates random numbers')
  .addParam('blocks', 'Array of block numbers', undefined, types.json)
  .addParam('secret', 'Secret number', undefined, types.int)
  .setAction(async ({ blocks, secret }: { blocks: number[], secret: number }, hre) => {
    const provider = hre.network.provider
    const hexSecret = BigNumber.from(secret).toHexString().substring(2)
    const randomNumbers: BigNumber[] = []

    for (const block of blocks) {
      const blockHash = await getBlockHash(provider, block)
      const randomNumberHash = utils.keccak256(blockHash.concat(hexSecret))
      randomNumbers.push(BigNumber.from(randomNumberHash))
    }

    randomNumbers.forEach((randomNumber, index) => {
      console.log(`Random number for block #${blocks[index]}: ${randomNumber}`)
    })
  })

async function getBlockHash(provider: EthereumProvider, blockNumber: number) {
  const hexBlockNumber = BigNumber.from(blockNumber).toHexString()
  const block: GetBlockNumberResponse = await provider.send('eth_getBlockByNumber', [hexBlockNumber, true])
  return block.hash
}
