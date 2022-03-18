import { extendEnvironment, task, types } from "hardhat/config";
import { deployDevcon } from "scripts/deploy";
import "@nomiclabs/hardhat-waffle";
import { Devcon6 } from "contracts";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumberish, Signer } from "ethers";
import { lazyObject } from "hardhat/plugins";

declare module "hardhat/types/runtime" {
  // devcon field will be available in Hardhat Runtime Environment tasks, actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    contracts: {
      devcon: Devcon6
      setDevcon: (devcon: Devcon6) => void
    };
    devcon: Devcon6
    something: String
  }
}

extendEnvironment((hre) => {
  hre.contracts = lazyObject(() => {
    console.log("Doing something")
    console.log("Did something")
    return {
      devcon: undefined,
      setDevcon: (devcon: Devcon6) => {
        hre.contracts.devcon = devcon
      }
    }
  })
})

async function deployContracts(hre: HardhatRuntimeEnvironment): Promise<Devcon6> {
  const [owner] = await hre.ethers.getSigners()

  console.log("Deploying contracts...")

  const now = (new Date()).valueOf()
  await hre.network.provider.send("evm_setNextBlockTimestamp", [now])
  const devcon = await deployDevcon(now, owner)

  // hre.contracts.devcon = devcon

  console.log("Contracts deployed")
  return devcon
}

task("deploy", "Deploys Devcon6 contracts").setAction(async (_, hre) => {
  // const devcon = hre.contracts.devcon
  // console.log(devcon)

  const devcon = await deployContracts(hre)
  hre.devcon = devcon
  console.log(hre.devcon)
  hre.contracts.setDevcon(devcon)

  // await devcon.getState()
});

task("fast-forward", "Fast forwards a period of node's time")
  .addParam<number>("value", "Time in seconds to fast forward", undefined, types.int, false)
  .setAction(async ({ value }: { value: number }, hre) => {
    const provider = hre.network.provider

    console.log('Fast forwarding %d seconds', value)
    await provider.send('evm_increaseTime', [value])
    await provider.send('evm_mine')
  })

task("bid", "Bids with given amount")
  .addParam<string>("address", "The bidder's address")
  .addParam<number>("amount", "The bid's amount")
  .setAction(async (
    { address, amount }: { address: string, amount: number },
    hre
  ) => {
    console.log(hre.devcon)
    console.log(hre.contracts.devcon)
    const signer = await hre.ethers.getSigner(address)

    const devcon = await hre.contracts.devcon
    await bidAsSigner(devcon, signer, amount)
  })

async function bidAsSigner(devcon: Devcon6, signer: Signer, value: BigNumberish) {
  await devcon.connect(signer).bid({ value })
}

// TODO: document and move to Readme.md
// hardhat --network localhost node
// hardhat --network localhost deploy
// hardhat --network localhost bid --address 0xa0ee7a142d267c1f36714e4a8f75612f20a79720 --amount 100
// hardhat --network localhost fast-forward --value 100
