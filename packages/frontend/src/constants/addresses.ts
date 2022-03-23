import { ChainId } from '@usedapp/core'

export const ADDRESSES = {
  multicall: {
    [ChainId.Mainnet]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    [ChainId.Ropsten]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    [ChainId.Hardhat]: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
  },
  devcon: {
    [ChainId.Hardhat]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
}
