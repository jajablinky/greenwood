"use client"

import { useCallback, useSyncExternalStore } from "react"
import clsx from "clsx"

import { Button } from "components/atoms/Button"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"
import { useArweaveProvider } from "providers/ArweaveProvider"

import * as C from "./styles"

type ConnectWalletButtonProps = {
  className?: string
  /** Same ghost text button as feed header “Create” (no wallet pill chrome). */
  feedHeader?: boolean
}

function pillClass(
  feedHeader: boolean | undefined,
  c: string,
): string | undefined {
  return feedHeader ? undefined : c
}

/**
 * Default: pill + hairline border (compact). Use `feedHeader` next to header Create.
 */
export function ConnectWalletButton({
  className,
  feedHeader,
}: ConnectWalletButtonProps) {
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
        className={clsx(pillClass(feedHeader, C.pillChecking), className)}
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
        className={clsx(pillClass(feedHeader, C.pillMissing), className)}
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
        className={clsx(pillClass(feedHeader, C.pillConnected), className)}
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
      className={clsx(pillClass(feedHeader, C.pill), className)}
    >
      {isConnecting ? "…" : "Connect"}
    </Button>
  )
}
