import { deploy, reservePrice } from './deploy'
import { Devcon6 } from 'contracts'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { bidAsSigner } from 'scripts/utils/bid'
import * as hre from 'hardhat'

async function run() {
  const nodeProcess = hre.run('node')
  await delay(500)

  const signers = await hre.ethers.getSigners()

  console.log('Deploying contracts...')

  const now = (new Date()).valueOf()
  await hre.network.provider.send('evm_setNextBlockTimestamp', [now])

  const owner = signers[0]
  const devcon = await deploy(now, owner)
  console.log('Contracts deployed\n')

  await bid(devcon, signers.slice(0, 20))

  await nodeProcess
}

async function bid(devcon: Devcon6, signers: SignerWithAddress[]) {
  for (const signer of signers) {
    await bidAsSigner(devcon, signer, reservePrice)
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

run()
