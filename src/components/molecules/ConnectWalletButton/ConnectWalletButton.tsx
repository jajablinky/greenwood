"use client"

import { useCallback, useSyncExternalStore } from "react"
import clsx from "clsx"

import { Button } from "components/atoms/Button"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"
import { useArweaveProvider } from "providers/ArweaveProvider"

import * as C from "./styles"

/**
 * Matches feed action controls: pill, hairline border, compact type (see Activity feed).
 */
export function ConnectWalletButton({ className }: { className?: string }) {
  const { walletAddress, isConnecting, walletUnavailable, connect, disconnect } =
    useArweaveProvider()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const onConnect = useCallback(async () => {
    await connect()
  }, [connect])

  const onDisconnect = useCallback(async () => {
    await disconnect()
  }, [disconnect])

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

  if (walletUnavailable) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled
        title="Install ArConnect or Wander to connect"
        className={clsx(C.pillMissing, className)}
      >
        Connect
      </Button>
    )
  }

  if (walletAddress) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isConnecting}
        title={`${walletAddress} — click to disconnect`}
        aria-label={`Connected as ${walletAddress}. Click to disconnect.`}
        onClick={onDisconnect}
        className={clsx(C.pillConnected, className)}
      >
        {abbreviateWalletAddress(walletAddress)}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isConnecting}
      aria-busy={isConnecting}
      title="Connect Arweave wallet"
      onClick={onConnect}
      className={clsx(C.pill, className)}
    >
      {isConnecting ? "…" : "Connect"}
    </Button>
  )
}
