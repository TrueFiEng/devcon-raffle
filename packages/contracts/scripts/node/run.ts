import { deploy, minBidIncrement } from './deploy'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { bidAsSigner } from 'scripts/utils/bid'
import * as hre from 'hardhat'
import { parseEther } from 'ethers/lib/utils'
import { Contract } from 'ethers'

const SECOND = 1000

async function run() {
  const nodeProcess = hre.run('node')
  await delay(500)

  const signers = await hre.ethers.getSigners()

  console.log('Deploying contracts...')

  const now = Math.floor((new Date()).valueOf() / SECOND)
  await hre.network.provider.send('evm_setNextBlockTimestamp', [now])

  const deployer = signers[0]
  const auctionRaffle = await deploy(now, deployer, hre)
  console.log('Contracts deployed\n')

  await bid(auctionRaffle, signers.slice(0, 20))

  await nodeProcess
}

async function bid(auctionRaffle: Contract, signers: SignerWithAddress[]) {
  const initialBidAmount = parseEther('0.20')
  for (let i = 0; i < signers.length; i++) {
    await bidAsSigner(auctionRaffle, signers[i], initialBidAmount.add(minBidIncrement.mul(i)))
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

run()
