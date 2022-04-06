export const setTimeoutImmediately = (func: () => void, interval: number) => {
  func()
  return setTimeout(func, interval)
}
