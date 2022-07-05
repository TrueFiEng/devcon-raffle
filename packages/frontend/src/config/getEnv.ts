import { BigNumber } from '@ethersproject/bignumber'

export function getStringEnv(key: string): string | undefined {
  const env = import.meta.env[key]
  if (typeof env === 'string' && env !== '') {
    return env
  }
  return undefined
}

export function getDateEnv(key: string): BigNumber | undefined {
  const dateString = getStringEnv(key)
  if (dateString !== undefined) {
    return BigNumber.from(new Date(dateString).getTime()).div(1000)
  }
}
