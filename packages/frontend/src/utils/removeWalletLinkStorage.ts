export function removeWalletLinkStorage() {
  Object.entries(localStorage)
    .map((entry) => entry[0])
    .filter((entry) => entry.substring(0, 11) === "-walletlink")
    .forEach((entry) => localStorage.removeItem(entry))
};
