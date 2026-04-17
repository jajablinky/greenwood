/**
 * Browser-side Ouroboros signing stack (ANS-104 + injected wallet).
 * Vendored from the Ouroboros web UI (`sign-http` / `dataitem` / `wallet-extension` modules).
 */
export { signHttpRequest, buildAuthenticatedUrl } from "./sign-http"
export {
  base64urlEncode,
  base64urlDecode,
  serializeTags,
  deepHash,
  createSignedDataItem,
  createSignedDataItemWithSigner,
  signRequest,
  type DataItemTag,
  type CreateDataItemOptions,
} from "./dataitem"
export {
  getInjectedWallet,
  connectInjectedWallet,
  signWithInjectedWallet,
  createSignedWalletDataItem,
  EXTENSION_PERMISSIONS,
} from "./wallet-extension"
