import { ExampleToken__factory } from "contracts";
import { Wallet } from "ethers";
import { MockProvider } from "@ethereum-waffle/provider/dist/esm/MockProvider";

export async function exampleTokenFixture(wallets: Wallet[], provider: MockProvider) {
    const exampleToken = await new ExampleToken__factory(wallets[2]).deploy(100, {gasLimit: 5_000_000})
  console.log(exampleToken.address)

    return { provider, exampleToken }
}
