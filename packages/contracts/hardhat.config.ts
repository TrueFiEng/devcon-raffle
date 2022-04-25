import 'hardhat-typechain'
import '@nomiclabs/hardhat-waffle'
import './abi-exporter'
import 'tsconfig-paths/register'
import 'hardhat-gas-reporter'
import 'scripts/tasks/nodeTasks'
import 'scripts/tasks/devcon/hardhatTasks'
import 'scripts/tasks/devcon/rinkebyTasks'

import mocharc from './.mocharc.json'
import compiler from './.compiler.json'

require('dotenv').config({ path: '../../.env' })

const zeroPrivateKey = '0x0000000000000000000000000000000000000000000000000000000000000000'

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
        count: 120
      },
      mining: {
        interval: 1000
      }
    },
    rinkeby: {
      url: 'https://rinkeby.arbitrum.io/rpc',
      accounts: [process.env.DEPLOYER || zeroPrivateKey]
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
