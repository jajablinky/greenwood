/**
 * App configuration. Ouroboros base URL is overridable per deployment.
 */
export const OUROBOROS_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_OUROBOROS_URL) ||
  "http://localhost:7789"

/** Permissions requested from the browser Arweave wallet (aligned with ao-marketing-site). */
export const WALLET_PERMISSIONS = [
  "ACCESS_ADDRESS",
  "ACCESS_PUBLIC_KEY",
  "SIGN_TRANSACTION",
  "DISPATCH",
  "SIGNATURE",
] as const
