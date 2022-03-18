import { task } from "hardhat/config";
import { deployDevcon } from "scripts/deploy";
import "@nomiclabs/hardhat-waffle";

task("deploy", "Deploys Devcon6 contracts").setAction(async (taskArgs, hre) => {
  const [owner] = await hre.ethers.getSigners()

  console.log("Deploying contracts...")
  await deployDevcon(owner)

  console.log("Contracts deployed")
});
