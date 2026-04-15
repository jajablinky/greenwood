/** Subset of the browser Arweave wallet API (e.g. ArConnect). */

export type ArweaveWalletApi = {
  connect: (
    permissions: string[],
    appInfo?: { name?: string }
  ) => Promise<void>
  disconnect: () => Promise<void>
  getActiveAddress: () => Promise<string>
}

export function getArweaveWallet(): ArweaveWalletApi | undefined {
  if (typeof window === "undefined") {
    return undefined
  }
  return (
    window as unknown as { arweaveWallet?: ArweaveWalletApi }
  ).arweaveWallet
}

export function shortenAddress(addr: string, head = 4, tail = 4): string {
  if (addr.length <= head + tail + 1) {
    return addr
  }
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`
}
