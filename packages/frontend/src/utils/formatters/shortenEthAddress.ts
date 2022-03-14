export const shortenEthAddress = (address: string) => `${address.substring(0, 6)}......${address.substring(42 - 4)}`
