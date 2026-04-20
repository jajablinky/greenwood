/* eslint-disable react-refresh/only-export-components -- app-wide wallet context */
import React from "react"

import { WALLET_PERMISSIONS } from "helpers/config"

export type ArweaveContextValue = {
  walletAddress: string | null
  isConnecting: boolean
  /** True when no injected wallet extension is available. */
  walletUnavailable: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const DEFAULT: ArweaveContextValue = {
  walletAddress: null,
  isConnecting: false,
  walletUnavailable: true,
  async connect() {},
  async disconnect() {},
}

const ArweaveContext = React.createContext<ArweaveContextValue>(DEFAULT)

export function useArweaveProvider(): ArweaveContextValue {
  return React.useContext(ArweaveContext)
}

export function ArweaveProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const walletUnavailable =
    typeof window === "undefined" || !("arweaveWallet" in window) || !window.arweaveWallet

  const refresh = React.useCallback(async () => {
    const w = window.arweaveWallet
    if (!w) {
      setWalletAddress(null)
      return
    }
    try {
      const a = await w.getActiveAddress()
      setWalletAddress(a?.trim() ? a : null)
    } catch {
      setWalletAddress(null)
    }
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    void refresh()
    const onChange = () => void refresh()
    window.addEventListener("arweaveWalletLoaded", onChange)
    window.addEventListener("walletSwitch", onChange)
    return () => {
      window.removeEventListener("arweaveWalletLoaded", onChange)
      window.removeEventListener("walletSwitch", onChange)
    }
  }, [mounted, refresh])

  const connect = React.useCallback(async () => {
    const w = window.arweaveWallet
    if (!w) return
    setIsConnecting(true)
    try {
      await w.connect([...(WALLET_PERMISSIONS as readonly string[])] as never)
      await refresh()
    } catch {
      setWalletAddress(null)
    } finally {
      setIsConnecting(false)
    }
  }, [refresh])

  const disconnect = React.useCallback(async () => {
    try {
      await window.arweaveWallet?.disconnect()
    } catch {
      /* ignore */
    }
    setWalletAddress(null)
  }, [])

  const value = React.useMemo<ArweaveContextValue>(
    () => ({
      walletAddress,
      isConnecting,
      walletUnavailable,
      connect,
      disconnect,
    }),
    [walletAddress, isConnecting, walletUnavailable, connect, disconnect],
  )

  return <ArweaveContext.Provider value={value}>{children}</ArweaveContext.Provider>
}
