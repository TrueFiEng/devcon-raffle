import { ChainId, Config as UseDAppConfig } from "@usedapp/core"

interface Config {
  useDAppConfig: UseDAppConfig
  allowedNetworks: number[]
}

export const CONFIG = getConfig(import.meta.env.MODE)

function getConfig(environment: string): Config {
  switch (environment) {
    case 'development':
      return getDevConfig()
    default:
      return getProdConfig()
  }
}

function getDevConfig() {
  return {
    useDAppConfig: {},
    allowedNetworks: [ChainId.Arbitrum, ChainId.ArbitrumRinkeby, ChainId.Localhost]
  }
}

function getProdConfig() {
  return {
    useDAppConfig: {},
    allowedNetworks: [ChainId.Arbitrum]
  }
}
