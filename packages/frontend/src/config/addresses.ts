import { ChainId } from '@usedapp/core'

import { SupportedChainId } from '../constants/chainIDs'

import { getStringEnv } from './getEnv'

export const ADDRESSES: Record<string, Record<SupportedChainId, string>> = {
  multicall: {
    [ChainId.Arbitrum]: '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2',
    [ChainId.ArbitrumRinkeby]: '0x5D6e06d3E154C5DBEC91317f0d04AE03AB49A273',
    [ChainId.Hardhat]: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  devcon: {
    [ChainId.Arbitrum]: '0xF53d383525117d1f51BF234966E39bD1508a5948',
    [ChainId.ArbitrumRinkeby]: '0x2d7435A78010bB613E1f22E0A8018733dd0C1Cfe',
    [ChainId.Hardhat]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
}

export function getAddresses() {
  const addresses = ADDRESSES
  const devcon = getStringEnv('VITE_TESTNET_DEVCON')
  if (devcon) {
    addresses['devcon'][ChainId.ArbitrumRinkeby] = devcon
  }
  return addresses
}
