export const setTimeoutImmediately = (func: () => void, interval: number) => {
  func()
  return setInterval(func, interval)
}
