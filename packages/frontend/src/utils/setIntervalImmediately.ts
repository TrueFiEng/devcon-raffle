export const setIntervalImmediately = (func: () => void, interval: number) => {
  func()
  return setInterval(func, interval)
}
