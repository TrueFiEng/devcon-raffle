import { task } from 'hardhat/config'
import { BigNumber, utils } from 'ethers'
import { EthereumProvider } from 'hardhat/types'
import { bytes32, intArray } from 'scripts/utils/types'
import { hashTwo } from 'scripts/utils/hashTwo'

interface Result {
  blockHash: string,
  randomNumber: string,
}

task('generate-random-numbers', 'Generates random numbers')
  .addParam('blocks', 'Array of block numbers', undefined, intArray)
  .addParam('secret', 'Secret number', undefined, bytes32)
  .setAction(async ({ blocks, secret }: { blocks: number[], secret: string }, hre) => {
    const provider = hre.network.provider

    const results: Result[] = []
    for (const block of blocks) {
      const blockHash = await getBlockHash(provider, block)
      const randomNumber = hashTwo(blockHash, secret)
      results.push({ blockHash, randomNumber })
    }

    results.forEach((result, index) => {
      console.log(`Random number for block #${blocks[index]} with hash ${result.blockHash}: ${result.randomNumber}`)
    })

    console.log(`\nRandom numbers as integer array: ${toIntArray(results)}`)
  })

async function getBlockHash(provider: EthereumProvider, blockNumber: number): Promise<string> {
  const hexBlockNumber = utils.hexlify(blockNumber)
  const response = await provider.send('eth_getBlockByNumber', [hexBlockNumber, true])

  if (!('hash' in response)) {
    console.log('RPC node response: ', response)
    throw new Error('Missing hash in RPC node response')
  }

  if (!utils.isHexString(response.hash)) {
    throw new Error('Invalid hash in RPC node response')
  }

  return response.hash
}

function toIntArray(results: Result[]): string {
  const ints = results.map(({ randomNumber }) => BigNumber.from(randomNumber).toString()).join(',')
  return '[' + ints + ']'
}
