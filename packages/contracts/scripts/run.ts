import { startGanache } from "./startGenache";
import { Wallet } from "ethers";
import { defaultAccounts } from "ethereum-waffle";
import { deployDevcon } from "./deploy";

async function run() {
  const provider = startGanache()
  const owner = new Wallet(defaultAccounts[0].secretKey, provider)
  await deployDevcon(owner)
}

run()
