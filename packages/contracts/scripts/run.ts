import { deployDevcon, reservePrice } from "./deploy";
import { Devcon6 } from "contracts";
import { BigNumberish, constants, Signer, utils } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const hre = require("hardhat")

async function run() {
  const signers = await hre.ethers.getSigners()

  console.log("Deploying contracts...")

  const now = (new Date()).valueOf()
  await hre.network.provider.send("evm_setNextBlockTimestamp", [now])
  const devcon = await deployDevcon(now, signers[0])
  console.log("Contracts deployed\n")

  await bid(devcon, signers.slice(0, 20))
}

async function bid(devcon: Devcon6, signers: SignerWithAddress[]) {
  for (let i = 0; i < signers.length; i++) {
    await bidAsSigner(devcon, signers[i], reservePrice)
    logBid(signers[i].address, reservePrice)
  }
}

async function bidAsSigner(devcon: Devcon6, signer: Signer, value: BigNumberish) {
  await devcon.connect(signer).bid({ value })
}

function logBid(address: string, bidAmount: BigNumberish) {
  console.log(`Account ${address} bid ${formatEther(bidAmount)}`)
}

function formatEther(balance: BigNumberish): string {
  return `${utils.formatEther(balance).toString()}${constants.EtherSymbol}`
}

run()
