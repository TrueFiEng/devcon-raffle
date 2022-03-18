import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("fast-forward", "Fast forwards a period of node's time")
  .addParam<number>("value", "Time in seconds to fast forward", undefined, types.int, false)
  .setAction(async ({ value }: { value: number }, hre) => {
    const provider = hre.network.provider

    console.log('Fast forwarding %d seconds', value)
    await provider.send('evm_increaseTime', [value])
    await provider.send('evm_mine')
  })
