/**
 * Vendored from ouroboros/src/web/src/wallet.ts — ANS-104 HTTP request signing (extension only).
 */
import { base64urlEncode } from "helpers/ouroboros/vendor/dataitem"
import { signWithInjectedWallet } from "helpers/ouroboros/vendor/wallet-extension"

function toArrayBuffer(u: Uint8Array): ArrayBuffer {
  return u.buffer instanceof ArrayBuffer
    ? u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength)
    : (new Uint8Array(u).buffer as ArrayBuffer)
}

/**
 * Sign an HTTP request as an ANS-104 data item.
 * Returns the base64url-encoded data item for use in the Authorization header.
 */
export async function signHttpRequest(
  method: string,
  path: string,
  body?: string | Uint8Array | null,
): Promise<string | null> {
  const bodyBytes = body
    ? typeof body === "string"
      ? new TextEncoder().encode(body)
      : body
    : new Uint8Array(0)
  const bodyHashBuf = await crypto.subtle.digest("SHA-256", toArrayBuffer(bodyBytes))
  const bodyHash = base64urlEncode(new Uint8Array(bodyHashBuf))
  const anchor = new Uint8Array(32)
  crypto.getRandomValues(anchor)
  const signed = await signWithInjectedWallet(bodyBytes, [
    { name: "Method", value: method },
    { name: "Path", value: path },
    { name: "Timestamp", value: Date.now().toString() },
    { name: "Body-Hash", value: bodyHash },
  ], anchor)
  return base64urlEncode(signed)
}

/**
 * Build an absolute URL with `auth` query param for GET requests (e.g. SSE).
 */
export async function buildAuthenticatedUrl(
  path: string,
  options?: {
    method?: string
    body?: string | Uint8Array | null
    baseUrl?: string
  },
): Promise<string> {
  const method = options?.method ?? "GET"
  const token = await signHttpRequest(method, path, options?.body ?? null)
  const target = new URL(options?.baseUrl ?? path, window.location.href)
  if (token) {
    target.searchParams.set("auth", token)
  }
  return target.toString()
}
