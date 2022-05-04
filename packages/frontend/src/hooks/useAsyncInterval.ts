import { useEffect, useRef } from 'react'
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async/dynamic'

export function useAsyncInterval(callback: () => Promise<void>, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = setIntervalAsync(() => savedCallback.current(), delay)

    return () => {
      clearIntervalAsync(id)
    }
  }, [delay])
}
