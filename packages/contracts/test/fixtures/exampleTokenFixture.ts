import { Wallet } from "ethers";
import { MockProvider } from "@ethereum-waffle/provider/dist/esm/MockProvider";
import { ExampleToken__factory } from "contracts";

export async function exampleTokenFixture(wallets: Wallet[], provider: MockProvider) {
    const exampleToken = await new ExampleToken__factory(wallets[0]).deploy(1000)

    return { provider, exampleToken }
}
