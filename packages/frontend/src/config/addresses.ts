import { ChainId } from '@usedapp/core'

import { SupportedChainId } from '../constants/chainIDs'

export const ADDRESSES: Record<string, Record<SupportedChainId, string>> = {
  multicall: {
    [ChainId.Arbitrum]: '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
    [ChainId.ArbitrumRinkeby]: '0x5D6e06d3E154C5DBEC91317f0d04AE03AB49A273',
    [ChainId.Hardhat]: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
  devcon: {
    [ChainId.Arbitrum]: '',
    [ChainId.ArbitrumRinkeby]: '',
    [ChainId.Hardhat]: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
}
