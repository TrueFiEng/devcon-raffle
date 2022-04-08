import { Call, useCall, useEthers } from '@usedapp/core'
import { Falsy, TypedContract } from '@usedapp/core/dist/cjs/src/model/types'
import { useEffect, useState } from 'react'

export function useCachedCall<T extends TypedContract>(call: Call<T> | Falsy) {
  const { library } = useEthers()
  const [cache, setCache] = useState(undefined)
  const { value, error } = useCall(!cache && call) ?? {}

  useEffect(() => {
    setCache(undefined)
  }, [library])

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
