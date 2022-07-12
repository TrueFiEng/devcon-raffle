import { task, types } from 'hardhat/config'
import { BigNumber, utils } from 'ethers'
import { EthereumProvider } from 'hardhat/types'

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
