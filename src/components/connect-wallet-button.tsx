import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  getArweaveWallet,
  shortenAddress,
} from "@/lib/arweave-wallet"
import { cn } from "@/lib/utils"

/** Match Hot / New visually: `py-px` offsets the 1px border vs their borderless `py-0.5`. */
const btnClass =
  "!h-auto min-h-0 shrink-0 rounded-sm border border-black/[0.1] px-2.5 py-px text-xs font-medium leading-normal tabular-nums shadow-none dark:border-white/[0.12]"

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
        variant="outline"
        size="sm"
        disabled
        className={cn(btnClass, "pointer-events-none opacity-50", className)}
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
        variant="outline"
        size="sm"
        disabled
        title="Install ArConnect (or another Arweave wallet) to connect"
        className={cn(btnClass, "opacity-60", className)}
      >
        Connect
      </Button>
    )
  }

  if (address) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        title={`${address} — click to disconnect`}
        aria-label={`Connected as ${address}. Click to disconnect.`}
        onClick={disconnect}
        className={cn(btnClass, "text-foreground", className)}
      >
        {shortenAddress(address)}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={busy}
      aria-busy={busy}
      title="Connect Arweave wallet"
      onClick={connect}
      className={cn(btnClass, className)}
    >
      {busy ? "…" : "Connect"}
    </Button>
  )
}
