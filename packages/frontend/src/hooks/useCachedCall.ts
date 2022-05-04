import { Call, useCall } from '@usedapp/core'
import { Falsy, TypedContract } from '@usedapp/core/dist/cjs/src/model/types'
import { useEffect, useState } from 'react'
import { SupportedChainId } from 'src/constants/chainIDs'

export function useCachedCall<T extends TypedContract>(call: Call<T> | Falsy, chainId?: SupportedChainId) {
  const [cache, setCache] = useState(undefined)
  const { value, error } = useCall(!cache && call, { chainId }) ?? {}

  useEffect(() => {
    setCache(undefined)
  }, [chainId])

  useEffect(() => {
    if (!cache && value) {
      setCache(value)
    }
  }, [cache, value])

  if (error) {
    return {
      value: undefined,
      error,
    }
  }

  return {
    value: cache ?? value,
    error: undefined,
  }
}
