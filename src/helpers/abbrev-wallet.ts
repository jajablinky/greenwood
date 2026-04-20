/** Deterministic fake 0x-prefixed address for mocks (20 bytes hex). */
export function mockEthereumAddressFromSeed(seed: string): string {
  let h = 2166136261
  const buf: number[] = []
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  for (let i = 0; i < 20; i++) {
    h = (Math.imul(h, i + 1) ^ seed.charCodeAt(i % seed.length)) >>> 0
    buf.push(h & 0xff)
  }
  return `0x${buf.map((b) => b.toString(16).padStart(2, "0")).join("")}`
}

/** e.g. `0x1234…cdef` from a full hex address. */
export function abbreviateWalletAddress(address: string): string {
  const a = address.trim()
  if (a.length <= 13) return a
  if (a.startsWith("0x")) {
    return `${a.slice(0, 6)}...${a.slice(-4)}`
  }
  return `${a.slice(0, 6)}...${a.slice(-4)}`
}
