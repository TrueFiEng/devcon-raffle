import { ChainId } from '@usedapp/core'
import { SupportedChainId } from 'src/config/config'

export const ADDRESSES: Record<string, Record<SupportedChainId, string>> = {
  multicall: {
    [ChainId.Arbitrum]: '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
    [ChainId.ArbitrumRinkeby]: '0x5D6e06d3E154C5DBEC91317f0d04AE03AB49A273',
    [ChainId.Hardhat]: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
  },
  devcon: {
    [ChainId.Arbitrum]: '',
    [ChainId.ArbitrumRinkeby]: '',
    [ChainId.Hardhat]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
}
