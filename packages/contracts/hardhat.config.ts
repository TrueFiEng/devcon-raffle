import 'hardhat-typechain'
import '@nomiclabs/hardhat-waffle'
import './abi-exporter'
import 'tsconfig-paths/register'
import 'hardhat-gas-reporter'
import 'scripts/tasks'

import mocharc from './.mocharc.json'
import compiler from './.compiler.json'

module.exports = {
    paths: {
        sources: './contracts',
        artifacts: './build',
        cache: './cache',
    },
    abiExporter: {
        path: './build',
        flat: true,
        spacing: 2,
    },
    networks: {
        hardhat: {
            initialDate: '2022-01-01T00:00:00',
            allowUnlimitedContractSize: true,
            accounts: {
              count: 120,
            }
        },
    },
    typechain: {
        outDir: 'build/types',
        target: 'ethers-v5',
    },
    solidity: {
        compilers: [compiler],
    },
    mocha: {
        ...mocharc,
        timeout: 400000,
    },
}
