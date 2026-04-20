/**
 * Vendored from ouroboros/src/web/src/wallet.ts (extension wallet signing only).
 */
import {
  base64urlDecode,
  base64urlEncode,
  createSignedDataItemWithSigner,
  type DataItemTag,
} from "helpers/ouroboros/vendor/dataitem"

type BrowserWalletDataItem = {
  data: string | Uint8Array
  target?: string
  anchor?: string
  tags?: DataItemTag[]
}

type BrowserWalletExtension = {
  walletName?: string
  connect(permissions: string[]): Promise<void>
  disconnect?(): Promise<void>
  getActiveAddress(): Promise<string>
  getActivePublicKey(): Promise<string>
  signature?: (
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
  ) => Promise<Uint8Array>
  signDataItem?: (
    dataItem: BrowserWalletDataItem,
    options?: Record<string, unknown>,
  ) => Promise<Uint8Array | ArrayBuffer | ArrayBufferView>
}

function toUint8Array(value: Uint8Array | ArrayBuffer | ArrayBufferView | string): Uint8Array {
  if (value instanceof Uint8Array) return value
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength))
  }
  try {
    return base64urlDecode(value)
  } catch {
    return new TextEncoder().encode(value)
  }
}

export function getInjectedWallet(): BrowserWalletExtension | null {
  if (typeof window === "undefined" || !("arweaveWallet" in window) || !window.arweaveWallet) {
    return null
  }
  return window.arweaveWallet as unknown as BrowserWalletExtension
}

/** Permissions required for Ouroboros ANS-104 auth + HyperBEAM message signing. */
export const EXTENSION_PERMISSIONS = [
  "ACCESS_ADDRESS",
  "ACCESS_PUBLIC_KEY",
  "SIGNATURE",
  "SIGN_TRANSACTION",
  "DISPATCH",
  "DECRYPT",
] as const

export async function connectInjectedWallet(): Promise<BrowserWalletExtension> {
  const wallet = getInjectedWallet()
  if (!wallet) {
    throw new Error(
      "No Arweave browser wallet was found. Install Wander or ArConnect to use PermawebOS.",
    )
  }
  await wallet.connect([...EXTENSION_PERMISSIONS] as never[])
  return wallet
}

export async function signWithInjectedWallet(
  data: string | Uint8Array,
  tags: DataItemTag[],
  anchor?: Uint8Array,
): Promise<Uint8Array> {
  const wallet = await connectInjectedWallet()
  if (wallet.signature) {
    const publicKeyN = await wallet.getActivePublicKey()
    const signature = wallet.signature
    return createSignedDataItemWithSigner(
      publicKeyN,
      async (signatureData) =>
        toUint8Array(await signature(signatureData, { name: "RSA-PSS", saltLength: 32 })),
      {
        tags,
        anchor,
        data: typeof data === "string" ? new TextEncoder().encode(data) : data,
      },
    )
  }
  if (!wallet.signDataItem) {
    throw new Error("The connected browser wallet does not expose a signing API that Ouroboros can use.")
  }
  const signed = await wallet.signDataItem({
    data,
    tags,
    ...(anchor ? { anchor: base64urlEncode(anchor) } : {}),
  })
  return toUint8Array(signed)
}

export async function createSignedWalletDataItem(
  body: string | Uint8Array,
  tags: DataItemTag[],
): Promise<Uint8Array> {
  const bodyBytes = typeof body === "string" ? new TextEncoder().encode(body) : body
  return signWithInjectedWallet(bodyBytes, tags)
}
