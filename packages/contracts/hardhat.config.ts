import 'hardhat-typechain'
import '@nomiclabs/hardhat-waffle'
import './abi-exporter'
import 'tsconfig-paths/register'
import 'hardhat-gas-reporter'
import 'scripts/tasks'
import 'scripts/testnetTasks'
import { constants } from 'ethers'

import mocharc from './.mocharc.json'
import compiler from './.compiler.json'

require('dotenv').config({ path: '../../.env' })

module.exports = {
  paths: {
    sources: './contracts',
    artifacts: './build',
    cache: './cache'
  },
  abiExporter: {
    path: './build',
    flat: true,
    spacing: 2
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      initialDate: '2022-01-01T00:00:00',
      allowUnlimitedContractSize: true,
      accounts: {
        count: 40
      }
    },
    rinkeby: {
      url: 'https://rinkeby.arbitrum.io/rpc',
      accounts: [process.env.DEPLOYER || constants.AddressZero]
    }
  },
  typechain: {
    outDir: 'build/types',
    target: 'ethers-v5'
  },
  solidity: {
    compilers: [compiler]
  },
  mocha: {
    ...mocharc,
    timeout: 400000
  }
}
