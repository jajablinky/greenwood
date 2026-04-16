import { useCallback, useEffect, useState } from "react"
import clsx from "clsx"

import { Button } from "components/ui/button"
import {
  getArweaveWallet,
  shortenAddress,
} from "helpers/arweave-wallet"

import * as C from "./styles"

/**
 * Matches feed action controls: pill, hairline border, compact type (see Activity feed).
 */
export function ConnectWalletButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const w = getArweaveWallet()
    if (!w) {
      return
    }
    try {
      const a = await w.getActiveAddress()
      setAddress(a?.trim() ? a : null)
    } catch {
      setAddress(null)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    void refresh()
  }, [refresh])

  const connect = useCallback(async () => {
    const w = getArweaveWallet()
    if (!w) {
      return
    }
    setBusy(true)
    try {
      await w.connect(["ACCESS_ADDRESS"], { name: "PermawebOS" })
      await refresh()
    } catch {
      setAddress(null)
    } finally {
      setBusy(false)
    }
  }, [refresh])

  const disconnect = useCallback(async () => {
    const w = getArweaveWallet()
    if (!w) {
      return
    }
    setBusy(true)
    try {
      await w.disconnect()
      setAddress(null)
    } finally {
      setBusy(false)
    }
  }, [])

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled
        className={clsx(C.pillChecking, className)}
        aria-label="Checking wallet"
      >
        Connect
      </Button>
    )
  }

  const wallet = getArweaveWallet()

  if (!wallet) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled
        title="Install ArConnect (or another Arweave wallet) to connect"
        className={clsx(C.pillMissing, className)}
      >
        Connect
      </Button>
    )
  }

  if (address) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={busy}
        title={`${address} — click to disconnect`}
        aria-label={`Connected as ${address}. Click to disconnect.`}
        onClick={disconnect}
        className={clsx(C.pillConnected, className)}
      >
        {shortenAddress(address)}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={busy}
      aria-busy={busy}
      title="Connect Arweave wallet"
      onClick={connect}
      className={clsx(C.pill, className)}
    >
      {busy ? "…" : "Connect"}
    </Button>
  )
}
